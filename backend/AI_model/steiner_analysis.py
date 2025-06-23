import cv2
import numpy as np
import os
import math

# دالة لقراءة نقاط الوسوم

def read_points(label_path):
    points = {}
    with open(label_path, 'r') as f:
        for line in f:
            parts = line.strip().split()
            cls_id = int(parts[0])
            x, y = float(parts[1]), float(parts[2])
            points[cls_id] = (int(x), int(y))
    return points

# دالة رسم خط بين نقطتين

def draw_line(img, p1, p2, color):
    cv2.line(img, p1, p2, color, 2)

# حساب الزاوية باتجاه صحيح

def angle_between(p1, center, p2):
    v1 = np.array(p1) - np.array(center)
    v2 = np.array(p2) - np.array(center)
    angle_rad = np.arccos(
        np.clip(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)), -1.0, 1.0)
    )
    angle_deg = np.degrees(angle_rad)
    return round(angle_deg, 2)

# رسم الزاوية وكتابة اسمها بجوارها

def draw_angle(img, pt1, pt2, pt3, label, offset):
    angle = angle_between(pt1, pt2, pt3)
    pos = (pt2[0] + offset[0], pt2[1] + offset[1])
    cv2.putText(img, f"{label}: {angle}°", pos,
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
    return angle

# الدالة الرئيسية

def analyze(image_path, label_path, output_root):
    CLASS_NAME_MAP = {
        0: 'ANS', 1: 'Ar', 2: 'Gn', 3: 'Go', 4: 'LI',
        5: 'UI', 6: 'LL', 7: 'Me', 8: 'N', 9: 'Or',
        10: 'Pog', 11: 'Po', 12: 'PNS', 13: 'S', 14: 'PogS',
        15: 'Sn', 16: 'A', 17: 'B', 18: 'UL'
    }

    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    points_raw = read_points(label_path)
    points = {CLASS_NAME_MAP[k]: v for k, v in points_raw.items() if k in CLASS_NAME_MAP}

    # رسم خطوط تحليل ستينر
    lines = [
        ("SN", 'S', 'N', (255, 0, 0)),
        ("NA", 'N', 'A', (0, 255, 0)),
        ("AB", 'A', 'B', (0, 0, 255)),
        ("NB", 'N', 'B', (255, 255, 0)),
        ("PogB", 'Pog', 'B', (255, 0, 255)),
        ("GoGn", 'Go', 'Gn', (0, 255, 255)),
        ("UI-LI", 'UI', 'LI', (128, 0, 128)),
        ("PoOr", 'Po', 'Or', (0, 128, 255)),
        ("ANS-PNS", 'ANS', 'PNS', (100, 255, 100))
    ]

    for _, p1, p2, color in lines:
        if p1 in points and p2 in points:
            draw_line(img, points[p1], points[p2], color)

    # رسم الزوايا مع إزاحات تقليل التداخل
    results = {}
    offset_map = {
        "SNA": (10, -10),
        "SNB": (10, 10),
        "ANB": (10, 25),
        "SND": (10, 40),
        "SN-Occl": (10, 55),
        "U1-NA": (10, 70),
        "L1-NB": (10, 85),
        "InterInc": (10, 100)
    }

    if all(k in points for k in ['S', 'N', 'A']):
        results['SNA'] = draw_angle(img, points['S'], points['N'], points['A'], 'SNA', offset_map['SNA'])
    if all(k in points for k in ['S', 'N', 'B']):
        results['SNB'] = draw_angle(img, points['S'], points['N'], points['B'], 'SNB', offset_map['SNB'])
    if 'SNA' in results and 'SNB' in results:
        results['ANB'] = round(results['SNA'] - results['SNB'], 2)
        pos = (points['N'][0] + offset_map['ANB'][0], points['N'][1] + offset_map['ANB'][1])
        cv2.putText(img, f"ANB: {results['ANB']}°", pos, cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
    if all(k in points for k in ['S', 'N', 'Gn']):
        results['SND'] = draw_angle(img, points['S'], points['N'], points['Gn'], 'SND', offset_map['SND'])
    if all(k in points for k in ['Po', 'Or', 'ANS']):
        results['SN-Occl'] = draw_angle(img, points['Po'], points['Or'], points['ANS'], 'SN-Occl', offset_map['SN-Occl'])
    if all(k in points for k in ['UI', 'N', 'A']):
        results['U1-NA'] = draw_angle(img, points['UI'], points['N'], points['A'], 'U1-NA', offset_map['U1-NA'])
    if all(k in points for k in ['LI', 'N', 'B']):
        results['L1-NB'] = draw_angle(img, points['LI'], points['N'], points['B'], 'L1-NB', offset_map['L1-NB'])
    if all(k in points for k in ['UI', 'LI', 'Gn']):
        results['InterInc'] = draw_angle(img, points['UI'], points['LI'], points['Gn'], 'InterInc', offset_map['InterInc'])

    # رسم النقاط
    for name, (x, y) in points.items():
        cv2.circle(img, (x, y), 4, (255, 255, 255), -1)

    # الحفظ
    image_out_dir = os.path.join(output_root, "Steiner_Images")
    report_out_dir = os.path.join(output_root, "Steiner_Reports")
    os.makedirs(image_out_dir, exist_ok=True)
    os.makedirs(report_out_dir, exist_ok=True)

    # حفظ الصورة
    img_save_path = os.path.join(image_out_dir, os.path.basename(image_path))
    cv2.imwrite(img_save_path, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))

    # حفظ التقرير
    report_path = os.path.join(report_out_dir, os.path.splitext(os.path.basename(image_path))[0] + ".txt")
    with open(report_path, "w", encoding="utf-8") as f:
        for k, v in results.items():
            f.write(f"{k} = {v}°\n")

    print(f"✅ تم حفظ صورة تحليل ستاينر في: {img_save_path}")
    print(f"📝 تم حفظ تقرير الزوايا في: {report_path}")
