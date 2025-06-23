import os
from pathlib import Path
import cv2
from ultralytics import YOLO

import sys
sys.path.append(os.path.dirname(__file__))

# أسماء النقاط حسب الكلاسات
CLASS_NAMES = [
    'Anterior nasal spine', 'Articulare', 'Gnathion', 'Gonion', 'Incision inferius',
    'Incision superius', 'Lower lip', 'Menton', 'Nasion', 'Orbitale',
    'Pogonion', 'Porion', 'Posterior nasal spine', 'Sella', 'Soft tissue pogonion',
    'Subnasale', 'Subspinale', 'Supramentale', 'Upper lip'
]

def analyze(image_path, analysis_type, output_dir, base_name):
    image_output_dir = os.path.join(output_dir, "images")
    label_output_dir = os.path.join(output_dir, "labels")
    os.makedirs(image_output_dir, exist_ok=True)
    os.makedirs(label_output_dir, exist_ok=True)


    # استخراج لاحقة الصورة الأصلية (مثلاً: .jpg أو .png)
    original_ext = Path(image_path).suffix.lower()

    # تحميل النموذج
    model = YOLO(r'C:\Users\VAIO\Desktop\SemesterProject\CephAlignify\backend\AI_model\best.pt')
    results = model.predict(
        source=image_path,
        save=False,
        conf=0.3,
        device='cpu',
        verbose=False
    )

    for result in results:
        img_name = base_name + "_points" + original_ext
        txt_name = base_name + "_labels.txt"

        original_img = cv2.imread(image_path)
        best_per_class = {}

        for box in result.boxes.data:
            cls = int(box[5].item())
            conf = box[4].item()
            x1, y1, x2, y2 = box[:4]
            cx, cy = float((x1 + x2) / 2), float((y1 + y2) / 2)
            if cls not in best_per_class or conf > best_per_class[cls]['conf']:
                best_per_class[cls] = {'x': cx, 'y': cy, 'conf': conf}

        for cls, data in best_per_class.items():
            x, y = int(data['x']), int(data['y'])
            cv2.circle(original_img, (x, y), 5, (0, 0, 255), -1)

        image_save_path = os.path.join(image_output_dir, img_name)
        cv2.imwrite(image_save_path, original_img)

        label_save_path = os.path.join(label_output_dir, txt_name)
        with open(label_save_path, 'w') as f:
            for cls, data in best_per_class.items():
                x, y, conf = data['x'], data['y'], data['conf']
                f.write(f"{cls} {round(x, 6)} {round(y, 6)} {round(conf, 4)}\n")

    # إعداد متغيرات ستينر
    steiner_path = None
    report_path = None

    if analysis_type == "Steiner":
        from steiner_analysis import analyze as steiner_draw
        steiner_draw(image_save_path, label_save_path, output_dir)

        steiner_path = os.path.join(output_dir, "Steiner_Images", os.path.basename(image_save_path))
        report_name = base_name + ".txt"
        report_path = os.path.join(output_dir, "Steiner_Reports", report_name)

    return {
        "points_image": image_save_path,
        "label_file": label_save_path,
        "steiner_image": steiner_path,
        "steiner_report": report_path,
    }