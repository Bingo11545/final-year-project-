# CHAPTER THREE: SYSTEM MODEL

## 3.1 Scenario

The system model provides a conceptual representation of the **AI-Integrated Missing Person Finder**, detailing how users interact with the application and how data flows between different components. To understand the practical application of the system, consider the following real-world scenario:

**Scenario: Reporting and Identifying a Missing Child**
A parent, *Mrs. Almaz*, realizes her son is missing. She accesses the web-based system via her smartphone. She registers an account and selects "Report Missing Person." She fills in details such as her son's name, age, last seen location, and uploads a recent clear photograph. She attempts to submit, but the system prompts her to clarify the "Last Seen Date." Once corrected, she submits the report.
Before submitting a report on the website, she first obtains an official police identification/reference from the nearest police station and attaches a scanned copy to the submission; the submission is routed for Police Admin verification before final site Admin approval. When the Police Admin reviews the submission they check the police letter and report details — if the police letter is correct the Police Admin approves (records verifier ID and timestamp) and the report proceeds to the site Admin for final approval; if incorrect or incomplete, the Police Admin marks the report as requiring correction and the system notifies the reporter with clear instructions on what to fix.

On the backend, the system's AI module automatically generates a facial embedding (a unique digital signature) from the uploaded photo. The report is initially marked as "Pending" and flagged for review.

A police officer, *Officer Kebede*, logs into the Dashboard. He sees a notification for a new pending report. He reviews the details, ensures the photo is valid, and approves the report. The status changes to "Active / Missing," and the child’s profile becomes visible on the public gallery.

Two days later, a concerned citizen, *Ato Bekele*, sees a child matching the description in a park. He takes a photo from a distance and uses the "Search by Image" feature on the portal (or submits a Tip). The AI compares this new photo against the database of active missing persons. It returns a **92% match** with Mrs. Almaz’s son. The system alerts Officer Kebede, who then contacts Mrs. Almaz and coordinates the recovery.

### 3.1.1 Use Case Model

The Use Case Model identifies the primary actors who interact with the system and the specific functions (use cases) they perform.

**Actors:**
1.  **Public User (Guest):** An unregistered user who accesses the site to view active cases or submit anonymous tips.
2.  **Registered User:** A verified member of the public (e.g., family member) who can report missing persons and manage their own profile.
3.  **Law Enforcement (Admin):** Users with elevated privileges responsible for verifying reports, managing case statuses, and viewing sensitive tip information.
4.  **System Administrator:** Responsible for user management, system maintenance, and database integrity.

**Core Use Cases:**
*   Register / Login
*   Report Missing Person
*   Search for Missing Person (Text & Image)
*   Verify / Approve Report (Admin)
*   Submit Tip / Sighting
*   Update Case Status
*   Generate System Report

### 3.1.2 Use Case Diagram

*Note: The following description represents the visual Use Case Diagram.*

The diagram depicts a boundary box representing the "Missing Person System."
*   **Public User** connects to: *View Public Gallery*, *Search by Name*, *Search by Image*, *Submit Tip*.
*   **Registered User** extends Public User and connects to: *File Report*, *Edit Own Report*, *Receive Notification*, *Upload Photo*.
*   **Law Enforcement** connects to: *Approve/Reject Report*, *View All Tips*, *Update Case Status*, *Access Analytics*.
*   **System Admin** connects to: *Manage Users*, *Configure System*.

### 3.1.3 Description of Use Case Model

The following tables detail the flow of events for the most critical use cases.

**Table 3.1: Use Case – Report Missing Person**

| Field | Description |
| :--- | :--- |
| **Use Case Name** | Report Missing Person |
| **Primary Actor** | Registered User (Family Member) |
| **Pre-condition** | User must be logged in and should obtain an official police identification/reference from the nearest police station (a scanned copy or photo to attach). |
| **Description** | Allows a user to submit details and a photo of a missing person. The submission must include the police identification document to proceed. |
| **Main Flow** | 1. User navigates to "Report" page. <br> 2. System displays intake form. <br> 3. User enters required details (Name, Age, Location). <br> 4. User uploads high-quality image. <br> 5. User attaches scanned police identification or police-issued form. <br> 6. System validates input, image format, and presence of police ID. <br> 7. User clicks "Submit". <br> 8. System saves data and initiates AI processing; case status is set to "Pending" and routed for Police Admin verification. |
| **Post-condition** | A new "Pending" record is created and awaits Police Admin verification. Once Police Admin verifies the police ID and approves, the site Admin performs the final approval and the case status changes to "Active / Missing" and becomes visible on public dashboards. |

**Police Verification Workflow**

1. After submission the report is routed to the assigned **Police Admin** for identity verification.
2. The **Police Admin** carefully checks the attached police letter/document and report details. If the police letter and the report details are correct and satisfy verification rules, the Police Admin marks the report as "Police Verified", records verification metadata (verifier ID, timestamp, notes), and may add comments for the site Admin. If the police letter or details are incorrect or incomplete, the Police Admin marks the report as "Verification Failed" (or "Requires Correction") and provides the reporter with a clear reason and instructions for correction (for example: missing signature, mismatched names, incomplete form).
3. The system notifies the site **Admin** that the report has been police-verified and is ready for final review. If the report was marked "Requires Correction", the system notifies the reporting user with the Police Admin's comments and the required next steps.
4. The site **Admin** reviews police-verified reports and, if appropriate, approves the report to change its status to "Active / Missing". The report then appears on the public gallery and admin/police dashboards.
5. If verification ultimately fails (after correction attempts) the report remains "Pending/Rejected" and the system records the rejection reason and notifies the reporting user with instructions for re-submission or escalation to a police station.

**Notes on Roles and Visibility**
- **Reporting User:** Must provide police identification when filing; can view the submission status (Pending → Police Verified → Admin Approved/Rejected).
- **Police Admin:** Authorized personnel at a police station who perform ID verification; their approval is required before site Admin finalizes publication.
- **Site Admin:** Reviews police-verified reports for policy compliance and public safety concerns prior to making a case public.

This dual-approval flow (Police Admin verification followed by Site Admin final approval) strengthens authenticity of reported cases and reduces false or malicious postings while preserving a clear audit trail for each verification step.

**Table 3.2: Use Case – Search by Image (AI Match)**

| Field | Description |
| :--- | :--- |
| **Use Case Name** | Search by Image |
| **Primary Actor** | Public User / Law Enforcement |
| **Pre-condition** | Database must contain active missing person records. |
| **Description** | User uploads a photo of a found/sighted person to find a match. |
| **Main Flow** | 1. User selects "Image Search". <br> 2. User uploads the probe image. <br> 3. System sends image to AI Microservice. <br> 4. AI calculates vector and compares with stored vectors. <br> 5. System returns a list of candidates with similarity scores. |
| **Alternative Flow** | If no match > 60% is found, system displays "No Matches Found." |

### 3.1.4 Activity Diagram

The Activity Diagram illustrates the sequential logic of the "Reporting Process."

1.  **Start**
2.  **User fills report form**
3.  **User uploads photo**
4.  **System validates inputs?**
    *   *No:* Show error message -> Go to Step 2.
    *   *Yes:* Proceed.
5.  **System checks for duplicates?**
    *   *Match Found:* Warn User -> "Is this the same person?"
6.  **Save to Database (Status: Pending)**
7.  **Trigger AI Embedding Generation**
8.  **Notify Admin for Review**
9.  **End**

### 3.1.5 Object Model

The Object Model represents the key concepts and valid entities within the system domain. The primary objects identified are:
*   **User:** The entity representing any person interacting with the system.
*   **MissingPerson:** The core entity containing all demographic and biometric data of the missing individual.
*   **Tip:** Information provided by third parties regarding a specific case.
*   **Notification:** Alerts generated by the system for users.
*   **FaceEmbedding:** The mathematical representation of the face (though stored within MissingPerson, it is logically a distinct data object).

### 3.1.6 Data Dictionary

The Data Dictionary defines the structure of the database collections (MongoDB Models).

**1. Table: Users**
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier (Primary Key) |
| `username` | String | Unique login name |
| `email` | String | Contact email (Unique) |
| `role` | Enum | 'admin', 'law_enforcement', 'public_user' |
| `isVerified` | Boolean | Verification status for official accounts |

**2. Table: MissingPersons**
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `fullName` | String | Name of missing person |
| `age` | Number | Age at time of disappearance |
| `gender` | Enum | Male, Female, Other |
| `photoUrl` | String | Path to stored image file |
| `faceDescriptor` | Array | 128-float vector generated by AI |
| `status` | Enum | Missing, Found, Deceased, Resolved |
| `lastSeenDate` | Date | Time of disappearance |
| `isApproved` | Boolean | Admin approval flag |

**3. Table: Tips**
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `personId` | ObjectId | Reference to MissingPerson |
| `message` | String | Description of the sighting |
| `location` | String | Where the person was seen |
| `isAnonymous` | Boolean | Whether reporter identity is hidden |

### 3.1.7 Class Model

The Class Model describes the static structure of the code, including attributes and methods.

**Class: MissingPersonController**
*   `createReport(data, image): JSON` - Validates input and saves new case.
*   `getAllCases(filter): List<Case>` - Retrieves active cases with pagination.
*   `updateStatus(id, newStatus): Boolean` - Updates case lifecycle.
*   `generateEmbedding(imagePath): Vector` - Calls Python AI service.

**Class: AI_Service (Python Interface)**
*   `detect_face(image): Boolean` - Checks if a face exists.
*   `represent(image): List<Float>` - Returns vector embedding.
*   `verify(img1, img2): Float` - Returns distance metric between two faces.

**Class: User**
*   `register()`
*   `login()`
*   `resetPassword()`

### 3.1.8 Dynamic Modeling

Dynamic modeling captures the system's behavior over time using a Sequence Diagram for the **Image Search** process.

**Sequence: Search by Image**
1.  **User** uploads image to **Frontend (UI)**.
2.  **Frontend** sends POST request with image to **Backend API**.
3.  **Backend** saves image temporarily and calls **AI Service**.
4.  **AI Service** processes image using *DeepFace* and generates *Query Vector*.
5.  **AI Service** fetches all *Active Vectors* from **Database**.
6.  **AI Service** calculates Euclidean Distance between *Query Vector* and *Active Vectors*.
7.  **AI Service** returns sorted list of matches to **Backend**.
8.  **Backend** enriches data (adds Names/Dates) from **Database**.
9.  **Backend** returns JSON response to **Frontend**.
10. **Frontend** displays matching profiles to **User**.

### 3.1.9 User Interface

The User Interface (UI) is the bridge between the human operator and the system logic. It is designed to be responsive, accessible, and intuitive.

**1. Main Dashboard (Admin/Police)**
*   Provides a high-level overview.
*   **Widgets:** "Total Active Cases", "New Tips Pending", "Recent Recoveries".
*   **Sidebar Navigation:** Dashboard, Manage Cases, User Management, Analytics.

**2. Public Landing Page**
*   **Hero Section:** Search bar and "Report Missing" CTA button.
*   **Gallery Grid:** Cards displaying active missing persons (Photo, Name, Age, Location).
*   **Footer:** Emergency contacts and "About Project" links.

**3. Case Detail View**
*   Displays large photo of the missing person.
*   Shows descriptive Table: Height, Weight, Last Seen, Distinguishing Marks.
*   **Action Buttons:** "Submit Tip", "Share to Social Media", "Print Poster".

**4. Report Submission Form**
*   Multi-step wizard form to prevent user fatigue.
*   **Step 1:** Basic Info (Who).
*   **Step 2:** Incident Info (Where/When).
*   **Step 3:** Photo Upload & Verification.
*   **Step 4:** Review & Submit.

This detailed System Model ensures that all functional requirements defined in Chapter 2 are mapped to concrete structural and behavioral designs, providing a clear blueprint for the implementation phase.
