import cv2
import numpy as np
import os

# ───────────────────────────────
# دوال مساعدة
# ───────────────────────────────
def read_points(label_path):
    """قراءة نقاط YOLO (id  x  y) وتخزينها في قاموس {id: (x, y)}"""
    pts = {}
    with open(label_path, "r") as f:
        for line in f:
            cls, x, y = line.strip().split()[:3]
            pts[int(cls)] = (int(float(x)), int(float(y)))
    return pts


def draw_line(img, p1, p2, color=(255, 0, 0), thickness=3, style='solid'):
    """
    رسم خط صلب أو متقطع بين نقطتين.
    style = 'solid' أو 'dotted'
    """
    if style == 'solid':
        cv2.line(img, p1, p2, color, thickness)
    else:  # dotted
        dist = int(np.linalg.norm(np.array(p2) - np.array(p1)))
        for i in range(0, dist, 12):
            pt1 = tuple(np.round(np.array(p1) + (np.array(p2) - np.array(p1)) * i / dist).astype(int))
            pt2 = tuple(np.round(np.array(p1) + (np.array(p2) - np.array(p1)) * min(i + 6, dist) / dist).astype(int))
            cv2.line(img, pt1, pt2, color, thickness)


def put_point_name(img, name, pt, color=(200, 200, 0)):
    """كتابة اسم النقطة بجانبها"""
    cv2.putText(img, name, (pt[0] + 5, pt[1] - 5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1, cv2.LINE_AA)


def angle_apex(p1, apex, p2):
    """زاوية عند APEX بين p1-apex و p2-apex"""
    v1, v2 = np.array(p1) - apex, np.array(p2) - apex
    cosang = np.clip(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)), -1, 1)
    return round(np.degrees(np.arccos(cosang)), 2)


def acute_angle_between_lines(a1, a2, b1, b2):
    """إرجاع الزاوية الحادّة (≤ 90°) بين خطين عامين"""
    v1, v2 = np.array(a2) - np.array(a1), np.array(b2) - np.array(b1)
    cosang = np.clip(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)), -1, 1)
    ang = np.degrees(np.arccos(cosang))
    return round(ang if ang <= 90 else 180 - ang, 2)


def put_text(img, text, pos, color=(0, 255, 255)):
    cv2.putText(img, text, tuple(pos), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                color, 2, cv2.LINE_AA)


# ───────────────────────────────
# تحليل ستاينر
# ───────────────────────────────
def analyze(image_path, label_path, output_root):
    # خريطة معرف → اسم النقطة
    CLASS_NAME_MAP = {
        0: "ANS", 1: "Ar", 2: "Gn", 3: "Go", 4: "LI",
        5: "UI", 6: "LL", 7: "Me", 8: "N", 9: "Or",
        10: "Pog", 11: "Po", 12: "PNS", 13: "S", 14: "PogS",
        15: "Sn", 16: "A", 17: "B", 18: "UL"
    }

    # تحميل الصورة والنقاط
    img_rgb = cv2.cvtColor(cv2.imread(image_path), cv2.COLOR_BGR2RGB)
    pts_raw = read_points(label_path)
    pts = {CLASS_NAME_MAP[k]: v for k, v in pts_raw.items() if k in CLASS_NAME_MAP}

    # ── رسم الخطوط الأساسية والمساعدة ──
    drawing_lines = [
        ("SN",    "S",  "N",   (255,   0,   0)),    # أزرق
        ("Occl",  "ANS","PNS", (  0, 255,   0)),    # أخضر
        ("UI-LI", "UI", "LI",  (128,   0, 128)),    # بنفسجي
        ("NA",    "N",  "A",   (255, 255,   0)),    # أصفر
        ("NB",    "N",  "B",   (  0, 255, 255)),    # سماوي
        ("S-Gn",  "S",  "Gn",  (255, 128,   0)),    # برتقالي
        ("UI-A",  "UI", "A",   (200,   0, 200)),    # أرجواني
        ("LI-B",  "LI", "B",   (  0, 150, 255)),    # أزرق فاتح
        ("UI-Gn", "UI", "Gn",  (150, 255, 150)),    # أخضر فاتح
    ]

    for _, p1, p2, col in drawing_lines:
        if p1 in pts and p2 in pts:
            draw_line(img_rgb, pts[p1], pts[p2], color=col, thickness=2)

    # رسم أسماء جميع النقاط
    for name, pt in pts.items():
        put_point_name(img_rgb, name, pt)
        cv2.circle(img_rgb, pt, 4, (255, 255, 255), -1)

    # ── حساب الزوايا وكتابتها ──
    results, off = {}, {
        "SNA": (10, -10), "SNB": (10, 10), "ANB": (10, 25),
        "SND": (10, 40), "SN-Occl": (10, 55), "U1-NA": (10, 70),
        "L1-NB": (10, 85), "InterInc": (10, 100)
    }

    # SNA
    if all(k in pts for k in ("S", "N", "A")):
        results["SNA"] = angle_apex(pts["S"], np.array(pts["N"]), pts["A"])
        put_text(img_rgb, f"SNA: {results['SNA']}°",
                 np.array(pts["N"]) + off["SNA"])

    # SNB
    if all(k in pts for k in ("S", "N", "B")):
        results["SNB"] = angle_apex(pts["S"], np.array(pts["N"]), pts["B"])
        put_text(img_rgb, f"SNB: {results['SNB']}°",
                 np.array(pts["N"]) + off["SNB"])

    # ANB
    if "SNA" in results and "SNB" in results:
        results["ANB"] = round(results["SNA"] - results["SNB"], 2)
        put_text(img_rgb, f"ANB: {results['ANB']}°",
                 np.array(pts["N"]) + off["ANB"])

    # SND
    if all(k in pts for k in ("S", "N", "Gn")):
        results["SND"] = angle_apex(pts["S"], np.array(pts["N"]), pts["Gn"])
        put_text(img_rgb, f"SND: {results['SND']}°",
                 np.array(pts["N"]) + off["SND"])

    # SN-Occl (S-N ↔ ANS-PNS)
    if all(k in pts for k in ("S", "N", "ANS", "PNS")):
        results["SN-Occl"] = acute_angle_between_lines(
            pts["S"], pts["N"], pts["ANS"], pts["PNS"])
        put_text(img_rgb, f"SN-Occl: {results['SN-Occl']}°",
                 np.array(pts["N"]) + off["SN-Occl"])

    # U1-NA
    if all(k in pts for k in ("UI", "N", "A")):
        results["U1-NA"] = angle_apex(pts["UI"], np.array(pts["N"]), pts["A"])
        put_text(img_rgb, f"U1-NA: {results['U1-NA']}°",
                 np.array(pts["N"]) + off["U1-NA"])

    # L1-NB
    if all(k in pts for k in ("LI", "N", "B")):
        results["L1-NB"] = angle_apex(pts["LI"], np.array(pts["N"]), pts["B"])
        put_text(img_rgb, f"L1-NB: {results['L1-NB']}°",
                 np.array(pts["N"]) + off["L1-NB"])

    # Inter-Incisal
    if all(k in pts for k in ("UI", "LI", "Gn")):
        results["InterInc"] = angle_apex(pts["UI"], np.array(pts["LI"]), pts["Gn"])
        put_text(img_rgb, f"InterInc: {results['InterInc']}°",
                 np.array(pts["LI"]) + off["InterInc"])

    # ───── حفظ النتائج ─────
    img_dir = os.path.join(output_root, "Steiner_Images")
    rep_dir = os.path.join(output_root, "Steiner_Reports")
    os.makedirs(img_dir, exist_ok=True)
    os.makedirs(rep_dir, exist_ok=True)

    img_out = os.path.join(img_dir, os.path.basename(image_path))
    cv2.imwrite(img_out, cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR))

    rep_out = os.path.join(rep_dir,
        os.path.splitext(os.path.basename(image_path))[0] + ".txt")
    with open(rep_out, "w", encoding="utf-8") as f:
        for k, v in results.items():
            f.write(f"{k} = {v}°\n")

    print(f"✅ صورة ستاينر حُفظت: {img_out}")
    print(f"📝 تقرير الزوايا حُفظ: {rep_out}")
