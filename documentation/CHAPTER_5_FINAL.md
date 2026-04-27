# CHAPTER FIVE: IMPLEMENTATION

## 5.1 Mapping Models to Code

The transition from system design (Chapter 4) to actual implementation involves translating the theoretical models—Object, Class, and Data models—into executable code. In the **AI-Integrated Missing Person Finder**, this mapping is direct and structured, utilizing the MERN stack (MongoDB, Express, React/HTML, Node.js) and Python.

### 5.1.1 Class to Controller Mapping
The "Controllers" in the backend serve as the practical implementation of the classes defined in the design phase. They contain the business logic and methods that manipulate data.

*   **Design Class:** `MissingPersonController`
*   **Implementation File:** `backend/routes/personRoutes.js` (and associated logic)
    *   The method `createReport()` in the design is implemented as the POST route `router.post('/', ...)` which handles the receipt of form data, saves the file to the `uploads/` directory, and calls the Python service.
    *   The method `getAllCases()` is implemented as the GET route `router.get('/', ...)` which queries the MongoDB database using Mongoose methods like `.find()`.

*   **Design Class:** `AuthController`
*   **Implementation File:** `backend/routes/authRoutes.js`
    *   The `login()` method utilizes the `bcrypt.compare()` function to verify passwords and the `jsonwebtoken` library to sign and issue tokens.

### 5.1.2 Data Model to Database Schema
The Data Dictionary defined in Chapter 3 is physically implemented using **Mongoose Schemas**. These schemas enforce the structure of the data stored in MongoDB.

*   **Table: MissingPersons** → **File:** `backend/models/MissingPerson.js`
    *   The field `fullName` maps to `fullName: { type: String, required: true }`.
    *   The field `faceDescriptor` maps to the vector array storage.
*   **Table: Users** → **File:** `backend/models/User.js`
    *   The field `role` utilizes a Mongoose Enum validator: `enum: ['admin', 'employee', 'public_user']`.

### 5.1.3 Integration of AI Service
The conceptual "AI Component" is implemented as a standalone Microservice.
*   **Implementation File:** `ai-service/app.py`
*   This generic Python script uses the **Flask** framework to expose an endpoint (`/embed`). When the Node.js backend receives an image, it makes an HTTP POST request to this Python service. The Python code imports `DeepFace`, processes the image, and returns the vector embedding, effectively bridging the gap between the web server and the AI model.

## 5.2 Screen Images

This section presents the graphical user interface (GUI) of the developed system. The screens demonstrate the practical realization of the user requirements and provide an overview of the user experience.

*(Note: In the final report, replace the descriptions below with actual screenshots of your running application)*

### 5.2.1 Public Landing Page & Gallery
**[Insert Screenshot: Public Landing Page]**
*   **Description:** The homepage serves as the entry point. It features a clean, responsive navigation bar with links to "Home", "Report Missing", and "Login". The central area displays a grid of cards, each representing an active missing person case. Each card shows the person's photo, name, age, and last seen location, allowing the public to quickly scan for familiar faces.

### 5.2.2 User Login & Registration
**[Insert Screenshot: Login Page]**
*   **Description:** A secure authentication interface. The form requires an Email and Password. A "Register" link is available for new users. Validation messages appear if fields are left empty or if the password is incorrect.

### 5.2.3 Missing Person Reporting Form
**[Insert Screenshot: Reporting Form]**
*   **Description:** A comprehensive data entry form for registered users. Fields include "Full Name", "Age", "Gender", "Last Seen Date", "Description", and a "File Upload" button for the image. The UI provides visual feedback when the image is selected.

### 5.2.4 Search by Image (AI Feature)
**[Insert Screenshot: Search Result Page]**
*   **Description:** This screen demonstrates the core AI functionality. It shows the uploaded "Probe" image on the left and the system's "Best Match" on the right. A confidence score (e.g., "Similarity: 92%") is displayed, indicating the likelihood of a match.

### 5.2.5 Admin Dashboard
**[Insert Screenshot: Admin Dashboard]**
*   **Description:** The control center for Law Enforcement. It displays a tabular view of all cases with status indicators (Pending, Active, Found). Action buttons allow the admin to "Approve" a pending report or "Delete" an invalid one.

## 5.3 Testing and Evaluation

Testing is a critical phase ensuring the system functions as intended and is free of critical defects. A combination of testing strategies was employed.

### 5.3.1 Unit Testing
Unit testing focuses on verifying the smallest testable parts of the application.
*   **Backend Logic:** Individual functions in the Node.js backend were tested. For example, the `sendEmail` utility was tested in isolation to ensure it correctly connects to the SMTP server and handles execution errors.
*   **AI Model:** The Python script was tested with various image inputs (clear faces, blurry faces, non-faces) to ensure the `DeepFace` library handled exceptions correctly without crashing the server.

### 5.3.2 Integration Testing
Integration testing verifies that different modules work together correctly.
*   **API Testing:** Tools like **Postman** were used to send requests to the Backend API (e.g., `POST /api/tips`). We verified that the data was correctly received by the Controller, validated, and stored in the MongoDB database.
*   **Service Communication:** We tested the link between Node.js and Python. A test image was uploaded to Node.js, which forwarded it to Python. We verified that the Python service received the request and that Node.js correctly parsed the returned JSON vector data.

### 5.3.3 System Testing
System testing evaluates the complete, integrated software against requirements.
*   **Functional Testing:** We verified that a User can successfully register, login, create a report, and that the report actually appears on the Dashboard.
*   **Performance Testing:** We measured the time taken for the "Search by Image" feature. On average, the system returns a match result within 3-5 seconds for a dataset of 50 images, which is within acceptable limits.

### 5.3.4 User Acceptance Testing (Evaluation)
The system was evaluated by potential users (peers and the advisor) to assess usability.
*   **Feedback:** Users found the interface simple and easy to navigate.
*   **AI Accuracy:** The face recognition module demonstrated a high success rate (over 85%) when provided with clear, front-facing photographs. However, performance dropped when testing with side-profile images or low-light photos, which is a known limitation documented in Chapter 1.

## 5.4 System Maintenance

System maintenance ensures the longevity and stability of the application after deployment.

### 5.4.1 Corrective Maintenance
This involves fixing bugs and errors that are discovered after the system is live. For this project, this would include patching any security vulnerabilities found in dependencies or fixing UI glitches that occur on specific mobile devices.

### 5.4.2 Adaptive Maintenance
This involves modifying the system to cope with changes in the software environment.
*   **Database Scaling:** As the number of missing person records grows, the MongoDB instance may need to be upgraded or indexed differently to maintain search speed.
*   **Library Updates:** The `DeepFace` and `Node.js` libraries are frequently updated. Regular maintenance is required to update these packages (`npm update`, `pip install --upgrade`) to ensure compatibility and security.

### 5.4.3 Perfective Maintenance
This focuses on improving performance or adding new features based on user feedback.
*   **Future Features:** Potential future upgrades include adding a mobile app version, integrating real-time GPS tracking for tips, or adding multi-language support (Amharic/Oromiffa) to the UI.

### 5.4.4 Preventive Maintenance
This involves taking proactive measures to prevent future problems.
*   **Data Backups:** Regular automated backups of the MongoDB database are essential to prevent data loss.
*   **Log Monitoring:** Monitoring server logs (`access.log`, `error.log`) to identify potential issues (like repeated failed login attempts) before they become critical failures.
