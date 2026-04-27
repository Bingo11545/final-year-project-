# AI Integrated Missing Person Finder

## Project Setup

### 1. Prerequisites
- Node.js installed
- Python 3.8+ installed
- MongoDB connection string (Already configured in backend/.env)

### 2. Backend Setup
Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```
Start the server:
```bash
npm start
```
The backend runs on `http://localhost:5000`.

### 3. AI Service Setup
Navigate to the `ai-service` folder.
Ideally, create a virtual environment first:
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```
Install dependencies:
```bash
pip install -r requirements.txt
```
Run the service:
```bash
python app.py
```
The AI service runs on `http://localhost:5001`.

### 4. Frontend Usage
Since the frontend uses pure HTML/JS, you can open `frontend/index.html` directly in your browser.
However, for better experience (and preventing CORS issues sometimes), use a simple HTTP server like "Live Server" in VS Code.

## Features Implemented
- **Authentication**: JWT based Login/Register with Roles (Admin, Law Enforcement, Public).
- **Reporting**: Upload missing person details + Photo.
- **AI Integration**: Automatically extracts facial embeddings using `DeepFace` (FaceNet model).
- **Auto-Matching**: When a new report is filed, it compares against existing database records and highlights matches > 60% similarity.
- **Dashboard**: View all cases, filter by status.

## Notes
- Images are stored locally in `backend/uploads` to simulate cloud storage.
- The AI matching uses a simple cosine similarity check against stored embeddings.
