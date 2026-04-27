# CHAPTER FOUR: SYSTEM DESIGN

## 4.1 Introduction

This chapter focuses on the architectural design and structural components of the **AI-Integrated Missing Person Finder**. It translates the requirements defined in Chapter 2 and the models from Chapter 3 into a concrete technical blueprint. The design ensures scalability, security, and maintainability by adopting a microservice-oriented architecture where image processing is decoupled from the main application logic. The goal is to create a robust system that can handle multimedia data (images) efficient while providing a seamless user experience for both the public and law enforcement.

## 4.2 Current Software Architecture

As detailed in the requirement analysis, the existing system for managing missing persons in the target environment is fundamentally manual and paper-based. It does not possess a software architecture in the technical sense.

*   **Data Storage:** Physical logbooks, filing cabinets, and locally isolated station registers.
*   **Communication:** Telephone calls, physical letters, and radio messages.
*   **Processing:** Manual human verification and visual comparison of printed photographs.

Therefore, there is no legacy software architecture to migrate, refactor, or integrate with. The proposed system is a "Greenfield" project, built from scratch to replace these manual workflows with a modern digital infrastructure.

## 4.3 Proposed Software Architecture

The proposed system adopts a **Service-Oriented Architecture (SOA)** with a specific implementation using the **MERN Stack** (MongoDB, Express.js, React/Node.js) coupled with a dedicated **Python AI Microservice**. This separation allows the web server to handle high-concurrency user requests while the Python service handles CPU-intensive image processing tasks independently.

### 4.3.1 System Decomposition

The system is decomposed into three distinct subsystems that communicate over HTTP/REST APIs.

**1. The Frontend Subsystem (Client-Side Presentation)**
*   **Responsibility:** Handling user interactions, displaying forms, rendering the missing person gallery, and managing session state.
*   **Components:**
    *   **Dashboard UI:** For police/admin to manage cases.
    *   **Public Reporting Wizard:** A step-by-step form for data entry.
    *   **Search Interface:** Allows text-based filtering and image uploading.
    *   **Authentication UI:** Login and Registration forms.

**2. The Backend Subsystem (Server-Side Logic)**
*   **Responsibility:** Business logic, database operations, user authentication, and API routing.
*   **Modules:**
    *   **Auth Module:** Handles registration, login, and JWT issuance.
    *   **Case Management Module:** CRUD (Create, Read, Update, Delete) operations for missing person records.
    *   **Tip Module:** Processing and linking tips to cases.
    *   **Notification Module:** Managing alerts for users.

**3. The AI Microservice (Image Processing)**
*   **Responsibility:** CPU-intensive computations and machine learning inference.
*   **Modules:**
    *   **Face Detector:** Locates faces in uploaded photos using OpenCV/RetinaFace.
    *   **Embedding Generator:** Converts faces to 128-dimensional vector representations using DeepFace.
    *   **Matcher:** Calculates Euclidean distance between query vectors and stored vectors to find matches.

### 4.3.2 Hardware/Software Mapping

This mapping illustrates how software components are deployed onto hardware resources.

| Software Component | Hardware / Cloud Environment | Technology Stack |
| :--- | :--- | :--- |
| **Client Application** | User's End Device (Smartphone, Laptop, Tablet) | HTML5, CSS3, JavaScript (Browser) |
| **API Server (Backend)** | Cloud Container (e.g., Render Web Service) | Node.js, Express framework |
| **AI Processor** | Cloud Container with High Memory (e.g., Render/AWS) | Python 3, Flask, TensorFlow |
| **Database Server** | Managed Cloud Cluster (MongoDB Atlas) | MongoDB (NoSQL) |
| **Image Storage** | Cloud Object Storage or Local File System | File System / CDN |

### 4.3.3 Persistent Data Modeling

The persistent data model relies on a **Document-Oriented** approach using MongoDB. Unlike relational databases (SQL), this allows for flexible schema adaptation, which is ideal for storing variable case data and vector arrays.

**Entity Relationships:**
*   **User (1) --- (N) Report:** A single registered user (e.g., a police officer or family member) can submit multiple missing person reports.
*   **User (1) --- (N) Tip:** A user can submit multiple tips (though tips can also be anonymous).
*   **MissingPerson (1) --- (N) Tip:** A specific missing person case can receive multiple tips/sightings from different citizens.
*   **MissingPerson (1) --- (1) Notification:** Status changes (e.g., "Found") trigger specific notifications to the original reporter.

The database is designed to be efficient for read-heavy operations (public viewing) while maintaining data integrity for write operations (reporting). The `MissingPerson` document embeds the critical `FaceEmbedding` vector array to allow for fast in-memory comparison without complex joins.

### 4.3.4 Access Control and Security

Security is enforced at multiple layers to protect sensitive personal data and verify the integrity of the investigation process.

**1. Authentication:**
*   **Strategy:** JSON Web Tokens (JWT).
*   **Process:** Upon successful Login, the server issues a digitally signed token containing the user's ID and Role. The client must attach this token to the `Authorization` header (`Bearer <token>`) for all subsequent protected requests. This ensures the server remains stateless.

**2. Authorization (Role-Based Access Control - RBAC):**
*   **Public (Guest):** Read-only access to "Active" cases. Can submit anonymous tips.
*   **Registered User:** Create privileges for "Reports" and "Tips"; Edit privileges only for their *own* reports.
*   **Law Enforcement / Admin:** Read/Write access to all records; Delete privileges; Access to "Pending" (unverified) cases; Ability to change case status to "Found" or "Closed".

**3. Data Security:**
*   **Passwords:** Hashed using `bcrypt` (with salt) before storage. Plain text passwords are never stored.
*   **Transmission:** All traffic between client and server is encrypted via TLS/SSL (HTTPS).
*   **Input Validation:** All API inputs are sanitized to prevent NoSQL Injection and Cross-Site Scripting (XSS).

### 4.3.5 Detailed Class Diagram

The class diagram elaborates on the logical structure of the backend code, defining the responsibilities of key controllers.

**1. AuthController**
*   `+ register(req, res)`: Validates input, talks to User model, returns token.
*   `+ login(req, res)`: Verifies credentials, returns token.
*   `+ getMe(req, res)`: Returns current user profile.
*   `- generateToken(userId): String`: Helper method to sign JWT.

**2. MissingPersonController**
*   `+ createMissingPerson(req, res)`: Handles form data and image upload.
*   `+ getMissingPeople(req, res)`: Returns filtered list of active cases.
*   `+ getMissingPerson(req, res)`: Returns details of a single ID.
*   `+ updateMissingPerson(req, res)`: Updates status or details.
*   `+ deleteMissingPerson(req, res)`: Removes record (Admin only).
*   `+ searchByImage(req, res)`: Proxies the image to AI Service and interprets results.

**3. AIController (Adapter)**
*   `+ detectFace(imagePath): Boolean`: Checks valid face presence.
*   `+ findMatch(targetImage): JSON`: Coordinates the matching logic.

**4. Middleware**
*   `+ protect(req, res, next)`: Verifies existence and validity of JWT.
*   `+ authorize(...roles)`: Checks if user.role is in allowed list.

### 4.3.6 Package Diagram

The package diagram organizes the source code into logical namespaces and folders, reflecting the project's directory structure.

```text
Project_Root/
├── frontend/ (Client Layer)
│   ├── css/          (Stylesheets)
│   ├── js/           (Scripts & API calls)
│   └── *.html        (Views / UI Pages)
├── backend/ (Server Layer)
│   ├── config/      (DB Connection & Environment Variables)
│   ├── controllers/ (Business Logic implementations)
│   ├── middleware/  (Auth & Error Handling)
│   ├── models/      (Mongoose Schemas for User, Person, Tip)
│   ├── routes/      (API Endpoints definitions)
│   ├── uploads/     (Local image storage)
│   └── utils/       (Helpers like EmailSender or Geocoder)
└── ai-service/ (Intelligence Layer)
    ├── model_weights/ (Pre-trained DeepFace models)
    ├── app.py       (Flask API entry point)
    └── requirements.txt
```

### 4.3.7 Deployment

The deployment architecture utilizes a cloud-native approach to ensure the system is accessible from anywhere and can handle concurrent users.

**Architecture:**
*   **Frontend:** Deployed on **Netlify**, serving static assets (HTML/JS/CSS) globally via a Content Delivery Network (CDN) for fast load times.
*   **Backend & AI:** Deployed on **Render** (Platform-as-a-Service). The Node.js server and Python Flask server run as separate services. They communicate via public HTTPS or a private service mesh.
*   **Database:** Hosted on **MongoDB Atlas** (Database-as-a-Service), which handles backups, scaling, and security updates automatically.

**Deployment Pipeline:**
1.  Developer pushes code changes to **GitHub**.
2.  **Render** detects changes in the `backend` directory and triggers a build (installing npm dependencies).
3.  **Render** detects changes in the `ai-service` directory and triggers a separate build (installing Python pip dependencies).
4.  **Netlify** detects changes in `frontend` and automatically deploys the new static site version.

This design ensures that updates can be rolled out continuously (CI/CD) without operational downtime, fulfilling the system's availability requirements.
