from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
from uuid import uuid4

app = Flask(__name__)
CORS(app)


def _temp_file_path(prefix, filename):
    return f"{prefix}_{uuid4().hex}_{filename or 'upload.jpg'}"


def _cleanup_file(path):
    if path and os.path.exists(path):
        os.remove(path)


def _face_boxes_from_path(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return img, []
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    boxes = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))
    return img, boxes


def _opencv_embedding(img_path):
    img, boxes = _face_boxes_from_path(img_path)
    if img is None:
        raise ValueError("Could not read image")

    if len(boxes) > 0:
        x, y, w, h = boxes[0]
        roi = img[y:y + h, x:x + w]
    else:
        roi = img

    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (64, 64), interpolation=cv2.INTER_AREA)
    normalized = resized.astype(np.float32) / 255.0
    return normalized.flatten().tolist()


def _cosine_similarity(vec_a, vec_b):
    a = np.array(vec_a, dtype=np.float32)
    b = np.array(vec_b, dtype=np.float32)
    denom = (np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)

# Mock database of embeddings for demonstration if DB not connected directly here
# In production, this service would fetch known embeddings from the DB or a vector DB
# Here we will receive an image and return its embedding, or compare two images.

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "AI Service Operational"})


@app.route('/', methods=['GET'])
def root():
    return jsonify({
        "service": "AI Service",
        "status": "ok",
        "health": "/health",
        "endpoints": ["/generate-embedding", "/validate-face", "/validate-id", "/verify"]
    })

@app.route('/generate-embedding', methods=['POST'])
def generate_embedding():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files['image']
    temp_path = _temp_file_path("temp", file.filename)
    file.save(temp_path)
    
    try:
        # Prefer DeepFace when available, fallback to OpenCV embedding when not installed.
        try:
            from deepface import DeepFace
            embedding = DeepFace.represent(img_path=temp_path, model_name="Facenet", enforce_detection=False)[0]["embedding"]
            return jsonify({"embedding": embedding, "model": "deepface-facenet"})
        except Exception:
            embedding = _opencv_embedding(temp_path)
            return jsonify({"embedding": embedding, "model": "opencv-fallback"})
    except Exception as e:
        return jsonify({"error": "AI backend error: " + str(e)}), 500
    finally:
        _cleanup_file(temp_path)

@app.route('/verify', methods=['POST'])
def verify_face():
    # Compare uploaded image against a list of candidate images (paths)
    data = request.json
    img_path_1 = data.get('img1_path')  # This would need to be accessible path
    img_path_2 = data.get('img2_path')
    
    try:
        try:
            from deepface import DeepFace
            result = DeepFace.verify(img1_path=img_path_1, img2_path=img_path_2, model_name="Facenet")
            return jsonify(result)
        except Exception:
            emb1 = _opencv_embedding(img_path_1)
            emb2 = _opencv_embedding(img_path_2)
            similarity = _cosine_similarity(emb1, emb2)
            return jsonify({
                "verified": similarity >= 0.75,
                "distance": 1.0 - similarity,
                "similarity": similarity,
                "model": "opencv-fallback"
            })
    except Exception as e:
        return jsonify({"error": "AI backend error: " + str(e)}), 500


# ============================================================
#  VALIDATE FACE — Ensures uploaded photo contains a human face
#  Used by the Report Missing Person form
# ============================================================
@app.route('/validate-face', methods=['POST'])
def validate_face():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files['image']
    temp_path = _temp_file_path("temp_face", file.filename)
    file.save(temp_path)
    
    try:
        try:
            from deepface import DeepFace
            result = DeepFace.extract_faces(
                img_path=temp_path,
                detector_backend="opencv",
                enforce_detection=True
            )

            if result and len(result) > 0:
                confidence = result[0].get("confidence", 0.85)
                return jsonify({
                    "is_human_face": True,
                    "confidence": float(confidence),
                    "faces_detected": len(result),
                    "detector": "deepface"
                })
            else:
                return jsonify({
                    "is_human_face": False,
                    "confidence": 0.0,
                    "reason": "No human face detected in the image",
                    "detector": "deepface"
                })
        except Exception:
            _, boxes = _face_boxes_from_path(temp_path)
            faces_detected = len(boxes)
            return jsonify({
                "is_human_face": faces_detected > 0,
                "confidence": 0.8 if faces_detected > 0 else 0.0,
                "faces_detected": faces_detected,
                "reason": None if faces_detected > 0 else "No human face could be detected in the uploaded image",
                "detector": "opencv-fallback"
            })
    except Exception as e:
        return jsonify({"error": "Face validation error: " + str(e)}), 500
    finally:
        _cleanup_file(temp_path)


# ============================================================
#  VALIDATE ID — Checks if uploaded document is an official ID
#  Used by the Registration form for law enforcement / org roles
# ============================================================
@app.route('/validate-id', methods=['POST'])
def validate_id():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files['image']
    temp_path = "temp_id_" + file.filename
    file.save(temp_path)
    
    try:
        # Read the image
        img = cv2.imread(temp_path)
        
        if img is None:
            os.remove(temp_path)
            return jsonify({
                "is_valid_id": False,
                "reason": "Could not read the uploaded file as an image"
            })
        
        height, width = img.shape[:2]
        aspect_ratio = width / height if height > 0 else 0
        
        # Convert to grayscale for analysis
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # ── ID Document Heuristics ──
        # An ID card/document typically has:
        # 1. Rectangular aspect ratio (landscape or portrait card shape)
        # 2. Contains text regions (high edge density)
        # 3. Has structured layout (lines, borders)
        # 4. Contains a face photo region
        # 5. Not just a random photo of nature/objects
        
        is_valid = True
        document_type = "Official ID"
        confidence_score = 0.0
        
        # Check 1: Reasonable dimensions (not tiny, not extremely large aspect ratio)
        if width < 200 or height < 150:
            is_valid = False
        
        # Check 2: Aspect ratio — ID cards are typically between 1.2:1 and 2:1 (landscape)
        # or between 0.5:1 and 0.85:1 (portrait). Letters/docs can be taller.
        id_like_ratio = (0.5 <= aspect_ratio <= 2.2)
        if not id_like_ratio:
            is_valid = False
        
        # Check 3: Edge detection — ID documents have lots of text/lines
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / (width * height)
        
        # ID documents typically have 5-30% edge density (text, borders, etc.)
        has_text_structure = (0.04 <= edge_density <= 0.45)
        if not has_text_structure:
            is_valid = False
        
        # Check 4: Try to detect face in the document (many IDs have photo)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))
        has_face = len(faces) > 0
        
        # Check 5: Color distribution — ID cards are not solid colors or pure photos
        # They have mixed text/graphics regions
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        saturation = hsv[:, :, 1]
        avg_saturation = np.mean(saturation)
        
        # Very high saturation = likely a colorful photo (not an ID)
        # Very low saturation = all grey (could be scan or not)
        
        # Calculate confidence
        confidence_factors = []
        
        if id_like_ratio:
            confidence_factors.append(0.25)
        if has_text_structure:
            confidence_factors.append(0.30)
        if has_face:
            confidence_factors.append(0.25)
            document_type = "Photo ID / Badge"
        if avg_saturation < 120:
            confidence_factors.append(0.10)
        if edge_density > 0.06:
            confidence_factors.append(0.10)
        
        confidence_score = sum(confidence_factors)
        
        # Final decision: need at least 0.55 confidence
        # Must have text structure at minimum
        if confidence_score < 0.55 or not has_text_structure:
            is_valid = False
        
        # Determine document type
        if has_face and has_text_structure:
            document_type = "Photo ID / Badge"
        elif has_text_structure and not has_face:
            document_type = "Authorization Letter / Document"
        
        os.remove(temp_path)
        
        return jsonify({
            "is_valid_id": is_valid,
            "confidence": round(confidence_score, 2),
            "document_type": document_type if is_valid else None,
            "reason": None if is_valid else "The uploaded image does not appear to be a valid official ID document or authorization letter"
        })
        
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": "ID validation error: " + str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5001)), debug=False)
