# CHAPTER TWO: REQUIREMENT ANALYSIS

## 2.1 Current System Description

The analysis of the existing system is the foundation upon which a new, robust solution is built. Before proposing the AI-Integrated Missing Person Finder, it is imperative to deeply understand the mechanics of the current operational environment utilized by law enforcement and the public in Ethiopia. The current system for reporting, investigating, and locating missing persons is predominantly manual, paper-based, and operates within a highly decentralized framework. It relies heavily on traditional communication channels and physical interaction, which, while established, presents significant bottlenecks in the digital age.

The existing workflow is characterized by disconnected information silos where data resides in physical logbooks at individual police stations, isolated from a central national database. This fragmentation means that a report filed in one sub-city or region is not immediately accessible to officers in another, creating a critical gap in intelligence sharing. The reliance on physical travel for reporting and the manual distribution of information results in a system that is reactive rather than proactive.

### 2.1.1 Major Functions of the Current System

The current system operates through a series of sequential, manual steps involving multiple human actors (family members, duty officers, investigation officers, and media personnel). The major functions can be broken down into the following detailed operational procedures:

**1. Physical Reporting and Intake Process:**
*   **Station Visit:** The primary function begins with the physical presence of the complainant (usually a family member) at the local police station closest to where the person was last seen. Remote reporting is generally unavailable.
*   **Identity Verification:** The duty officer must verify the identity of the person filing the report to prevent false claims. This involves checking their ID card and recording their relationship to the missing person.
*   **Manual Data Entry:** The officer opens a physical registry book (often referred to as the "Daily Occurrence Book" or a specific "Missing Persons Register"). They hand-write details such as the missing person's full name, age, physical description (height, skin color, clothing), and the time/place of disappearance.
*   **Photo Collection:** The family is asked to provide a recent physical photograph. If they do not have one on hand, the report is incomplete. If provided, the officer might staple or glue this photo into the file, or keep it loose in a folder, which risks loss or damage.

**2. Local Verification and Preliminary Search:**
*   **Detainment Check:** A major function of the current system is the internal check. The officer manually reviews the station’s own detainment logs to ensure the individual hasn't been arrested recently.
*   **Hospital Check:** Officers may call or physically visit local hospitals to check unidentified patient logs or morgue records. This is a time-consuming point-to-point communication function.
*   **Patrol Briefing:** The description of the missing person is read out during the morning or evening briefing (roll call) to patrol officers. This relies entirely on the officers' ability to memorize descriptions of multiple missing persons daily.

**3. Information Dissemination (Manual & Media):**
*   **Poster Creation:** Families often shoulder the burden of creating "Missing" posters. They must type out the details, scan the photo, print copies at a stationery shop, and physically paste them on walls, poles, and shop windows.
*   **Teletype/Radio Message:** In serious cases, the station may send a radio message or teletype to the central command. However, this text-based message is often devoid of visual data (photos), making identification difficult for receiving stations.
*   **Media Broadcasting:** To reach a wider audience, the system relies on national TV or Radio police programs. This involves a bureaucratic process where the police must write an official letter to the media house requesting airtime. The family then takes this letter to the broadcaster. This function is restricted by limited airtime slots and costs.

**4. Inquiry and Matching Procedures:**
*   **Walk-in Inquiries:** If a citizen spots a confusing or lost person, they bring them to the station. The officer must then rely on their memory of recent reports or manually flip through back-dated pages of the registry book to see if a matching report exists.
*   **Cross-Referencing:** There is no automatic cross-referencing. If a child is found in Zone A, but reported missing in Zone B, the systems do not "talk" to each other unless an officer in Zone A specifically calls Zone B to check.

### 2.1.2 Problems of the Existing System

The comprehensive analysis of the current manual system reveals fundamental flaws that contribute to low recovery rates and prolonged distress for families. These problems are systemic and inherent to non-digital workflows.

**1. Data Fragmentation and Lack of Centralization:**
The most critical problem is the lack of a unified database. Information is stored in scattered physical locations. A police station in *Bole* has no real-time access to the missing person records of *Yeka*. This geographic silence means that missing persons who move or are taken across administrative boundaries essentially "disappear" from the radar of local authorities where they are eventually found.

**2. High Latency and Slow Response Time:**
In missing person cases, the first 48 to 72 hours are crucial. The current system is plagued by latency.
*   *Reporting Latency:* It takes time to travel to a station and wait for an officer.
*   *Processing Latency:* It takes hours or days to produce and distribute posters.
*   *Communication Latency:* Inter-station communication relies on phone calls or physical letters, which are slow.
By the time a description is widely circulated, the missing person may have moved significantly far away or suffered harm.

**3. Inaccuracy and Human Error:**
*   *Subjective Descriptions:* A handwritten description like "medium height, dark clothes" is vague and applies to thousands of people.
*   *Memory Reliance:* Expecting patrol officers to remember the faces of dozens of missing persons based on a verbal briefing is unrealistic and unreliable.
*   *Transcription Errors:* Names and contact numbers can be written illegibly in logbooks, making follow-up impossible.

**4. Inefficient Image Matching:**
Comparing a found person against a database of physical photos is practically impossible at scale. An officer cannot look through thousands of cumulative files from the past year to find a match. This leads to "Cold Cases" where the information technically exists in a file cabinet, but is undiscoverable during a search.

**5. Lack of Public Engagement and Feedback:**
*   The public wants to help but lacks a secure, easy way to do so. Calling a police station can be intimidating or inconvenient.
*   There is no feedback loop. Families who file reports rarely receive updates unless they go to the station. This lack of transparency causes frustration and mistrust in the system.

**6. Vulnerability of Physical Records:**
Paper records are fragile. They degrade over time, photos fade, and pages tear. They are vulnerable to environmental hazards like fire or flood. Furthermore, searching through archives of old paper records is so labor-intensive that it is rarely done effectively, meaning long-term missing persons are often forgotten by the system.

## 2.2 Requirement Gathering

Requirement gathering is the process of defining the expectations of the stakeholders to ensure the proposed system solves the identified problems effectively. For the AI-Integrated Missing Person Finder, a rigorous and multi-faceted approach was adopted to capture both the technical and social requirements of the project.

### 2.2.1 Requirement Gathering Methods

To ensure a holistic understanding of the domain, the following specific methodologies were employed:

**1. Semi-Structured Interviews:**
Face-to-face interviews were conducted with key stakeholders to gain qualitative insights.
*   **Interview Group 1: Police Officers (Investigative & IT Units):** 
    *   *Objectives:* To understand the legal constraints, the exact data fields required for an official investigation, and their openness to adopting AI tools.
    *   *Key Questions:* "What is the hardest part of the current search process?", "What details are absolutely mandatory for a report?", "How do you currently verify if a person is actually missing?"
    *   *Insight:* Officers emphasized that while AI is good, they need the final authority to "Approve" a match before notifying a family to avoid false hope.
*   **Interview Group 2: Affected Families & General Public:**
    *   *Objectives:* To understand the emotional journey and the usability needs of non-technical users.
    *   *Key Questions:* "Would you be comfortable uploading a photo to a website?", "What device do you use to access the internet?"
    *   *Insight:* The system must be mobile-first, as most citizens access the internet via smartphones.

**2. Document Analysis (form and record review):**
The project team reviewed current physical forms used by the police.
*   **Form F-1 (Missing Person Report):** Analyzed to extract data attributes (Name, Age, Sex, Hair Color, Eye Color, Distinctive Marks like scars/tattoos, Clothes worn).
*   **Logbook Structure:** Analyzed how cases are indexed (chronologically vs. alphabetically) to design a better digital indexing strategy (e.g., by facial similarity or location).

**3. Observational Study:**
A field observation was conducted at a local police station. The researcher sat in the waiting area to observe the reporting process.
*   *Observation:* It was noted that families often forget specific details under stress.
*   *Implication:* The digital form should have helpful prompts and dropdowns (e.g., prompting for "Nickname" or "School Name") to trigger memory.

**4. Joint Application Design (JAD) Sessions (Simulated):**
Brainstorming sessions were held with the project advisor and peers to model the interaction between the AI service and the web backend.
*   *Outcome:* Defined the need for a separate "AI Microservice" because running heavy ML models on the same thread as the web server would slow down the user interface.

### 2.2.2 Business Rules

Business rules define the specific constraints and operational policies that the system must enforce to ensure it functions within the legal and logical boundaries of the organization.

*   **BR-01 (Verification Requirement):** A "Public" user can submit a missing person report, but the report status must remain generic "Pending" and not be searchable by the public until a "Police Admin" reviews and verifies the content.
*   **BR-02 (Identity Protection):** The contact information (Phone Organization, Address) of the reporting family must be encrypted in the database and hidden from the public view. Public users who have a tip must contact the system/police, who then mediate the contact with the family.
*   **BR-03 (One-to-Many Matching):** Every time a "Found Person" or "Sighting" image is uploaded, the AI system must trigger a search against **all** "Active" missing person records. It cannot search against "Closed" or "Found" records to save resources.
*   **BR-04 (Image Quality Threshold):** The system must reject images where the `Face_Confidence_Score` returned by the detector is below 0.85 (85%). This ensures that the database is not polluted with blurry or non-face images (e.g., photos of clothes or scenery).
*   **BR-05 (Jurisdictional Access):** Specific "Super Admins" can delete records. Standard "Police Officers" can only update the status of records but cannot permanently delete them to preserve audit trails.
*   **BR-06 (Data Retention):** If a person is found, their meaningful data (Name, Date Found) is archived for statistical reports, but their biometric data (Face Embedding) should be flagged as inactive to prevent false positives in future searches.
*   **BR-07 (Tip Anonymity):** The system must allow users to submit tips without logging in (Guest Mode). In this case, no IP tracking should be visible to the public, though stored for security audit logs.
*   **BR-08 (Duplicate Prevention):** The system should warn the user if a text-based search (Name + DoB) suggests the person has already been reported to prevent duplicate case files for the same individual.
*   **BR-09 (Age Progression - Limitation):** The system operates on the rule that the uploaded photo must be within a 5-year range of the current age. The system does not currently apply artificial age progression rules.
*   **BR-10 (Notification Logic):** Emails are sent to the reporter only when the status changes (e.g., Pending -> Active, Active -> Found).

## 2.3 Proposed System Description

### 2.3.1 Overview

The **AI-Integrated Missing Person Finder** is a comprehensive, web-based platform designed to act as a centralized intelligence hub for missing person investigations. It replaces the fragmented manual ledgers with a unified cloud-based database accessible from any device with internet connectivity. 

The core philosophy of the proposed system is **"Automation of Recognition."** Unlike traditional databases that are text-search based (requiring a correct spelling of a name to find a record), the proposed system utilizes **Visual Search**. By integrating **DeepFace**, a state-of-the-art Python-based facial recognition framework, the system gives the police a "superhuman" ability to compare a new face against thousands of stored faces instantly.

The architecture follows a **Three-Tier Model**:
1.  **Presentation Tier (Frontend):** A responsive, user-friendly interface built with HTML, CSS, and JavaScript (Client-side) that handles user interaction.
2.  **Logic Tier (Backend):** A Node.js/Express server that manages business logic, authentication, and API routing. It communicates with a specialized **Python AI Microservice** for image processing.
3.  **Data Tier (Database):** A MongoDB NoSQL database that offers the flexibility to store complex, semi-structured data like case files, image paths, and JSON-based face embeddings.

### 2.3.2 Functional Requirements

The functional requirements outline the specific behaviors, inputs, processes, and outputs that the system must support to meet user needs.

#### **I. User Management & Authentication Module**
*   **FR-01: User Registration**
    *   *Input:* Email, Password, Full Name, Phone Number.
    *   *Process:* Validate email format, check if email exists, hash password using Bcrypt.
    *   *Output:* Create user record, redirect to login.
*   **FR-02: User Login & Token Generation**
    *   *Input:* Email, Password.
    *   *Process:* Compare hashed password, generate JSON Web Token (JWT) with expiration.
    *   *Output:* Grant access to the dashboard based on role.
*   **FR-03: Role-Based Access Control (RBAC)**
    *   *Description:* The system shall differentiate between "Citizen", "Police Officer", and "System Admin". 
    *   *Constraint:* Citizens can only edit their *own* reports. Police can edit *any* report.

#### **II. Report Management Module**
*   **FR-04: Submit Missing Person Report**
    *   *Input:* Personal details (Name, Age, Gender), Incident details (Date, Location, Description), and **Image File**.
    *   *Process:* Upload image to storage (local/cloud), save text data to MongoDB with status "Pending".
*   **FR-05: View Active Cases (Gallery)**
    *   *Description:* The public landing page shall display a grid of "Active" cases.
    *   *Feature:* Include search filters (Search by Name, Search by Age Range, Search by City).
*   **FR-06: Case Status Management**
    *   *Description:* Admin users shall have a dropdown to update status: "Pending", "Active", "Found (Alive)", "Found (Deceased)", "Closed".
    *   *Output:* Changing status to "Found" removes the case from the public Active list.

#### **III. AI & Facial Recognition Module**
*   **FR-07: Face Embedding Generation**
    *   *Trigger:* When a user uploads a photo of a missing person.
    *   *Process:* The backend sends the image path to the Python script. DeepFace detects the face, crops it, and calculates a 128-d or 512-d vector embedding.
    *   *Output:* The vector array is stored in the database document for that person.
*   **FR-08: Automatic Verification (Search by Image)**
    *   *Input:* A single image uploaded by a user reporting a "Sighting" or a found person.
    *   *Process:* The system generates an embedding for the input image and calculates the Euclidean Distance or Cosine Similarity against all stored missing person embeddings.
    *   *Output:* Return a JSON list of matches with a distance score (e.g., "0.2 distance" implies a high match).
*   **FR-09: No-Face Exception Handling**
    *   *Process:* If the AI model detects zero faces or more than one face in a "Profile" photo upload.
    *   *Output:* Return a functional error message: "Please upload a photo containing exactly one clearly visible face."

#### **IV. Tips & Communication Module**
*   **FR-10: Anonymous Tip Submission**
    *   *Input:* Text description of sighting, specific location (optional GPS), optional photo.
    *   *Process:* Link the tip to the specific Case ID.
    *   *Output:* Alert the Admin/Police user via the dashboard notification center.
*   **FR-11: Dashboard Notifications**
    *   *Description:* The Admin dashboard shall have a "Recent Activities" panel showing new reports and new tips in chronological order.

#### **V. Administrative Module**
*   **FR-12: Statistics Generation**
    *   *Description:* The system shall calculate identifying metrics.
    *   *Output:* Display counts of "Total Missing", "Total Found", and "Recovery Rate %".

### 2.3.3 Nonfunctional Requirements

Nonfunctional requirements (NFRs) strictly define the quality attributes, performance constraints, and operational standards of the system. These are critical for the user experience and system viability.

#### **2.3.3.1 Performance**
*   **NFR-01 (Page Load):** The application’s Time to First Byte (TTFB) should be under 200ms. The main dashboard should fully render within 3 seconds on a standard 4G network (5Mbps).
*   **NFR-02 (AI Inference):** The facial recognition processing time is the most resource-intensive task. The system is required to return match results for a single image query against a dataset of 1,000 records in less than **10 seconds**.
*   **NFR-03 (Database Indexing):** MongoDB queries for text search (e.g., finding a person by name) must return in under 100ms. Proper indexing on `name` and `status` fields is required.

#### **2.3.3.2 Scalability**
*   **NFR-04 (Vertical Scalability):** The AI component (DeepFace) is CPU/RAM intensive. The architecture must allow the AI service to be moved to a larger server instance (e.g., upgrading from 1 vCPU to 4 vCPUs) without code changes.
*   **NFR-05 (Storage Scalability):** The system stores images. It must be configured to reference image URLs (stored in a scalable file system or cloud bucket like S3/Cloudinary) rather than storing binary image data directly in the database, allowing storage to grow indefinitely.

#### **2.3.3.3 Availability**
*   **NFR-06 (Uptime):** The system should aim for **99.9% availability** during operational hours (24/7 ideal). This equates to less than 45 minutes of downtime per month.
*   **NFR-07 (Redundancy):** Critical services (Database) should have an automated failover mechanism or regular backups (snapshots) every 24 hours to ensure data is available even after a critical failure.

#### **2.3.3.4 Reliability**
*   **NFR-08 (Robustness):** The system must not crash if a user uploads a corrupted image file. It must catch the exception and display a user-friendly error.
*   **NFR-09 (Accuracy):** The AI model is required to have a False Positive Rate (FPR) of less than 5% under optimal lighting conditions. While 100% accuracy is impossible, the system must reliably rank the correct person in the "Top 5" matches.

#### **2.3.3.5 Maintainability**
*   **NFR-10 (Code Modularity):** The codebase must follow the **MVC (Model-View-Controller)** pattern. This ensures that the User Interface (View) is decoupled from the Database Logic (Model), allowing developers to change the design without breaking the backend.
*   **NFR-11 (Comments and Documentation):** At least 30% of the codebase lines should be comments explaining complex logic, especially within the Python AI script and the JWT authentication middleware.

#### **2.3.3.6 Security**
*   **NFR-12 (Data Encryption - At Rest):** Use **Bcrypt** with a salt round of at least 10 to hash user passwords. Plain text passwords must never be stored.
*   **NFR-13 (Data Encryption - In Transit):** All data exchange between the client (browser) and server must occur over **HTTPS** (TLS 1.2 or higher) to prevent Man-in-the-Middle attacks.
*   **NFR-14 (Sanitization):** All API endpoints accepting user input (e.g., `req.body`) must utilize a validation library (like Joi or express-validator) to strip out malicious scripts (XSS protection) and NoSQL injection attempts.
*   **NFR-15 (JWT Security):** JSON Web Tokens must have a short lifespan (e.g., 24 hours) and be signed with a complex 256-bit secret key.

#### **2.3.3.7 Environmental**
*   **NFR-16 (Browser Compatibility):** The web frontend must utilize standard HTML5/CSS3 features and function correctly on all modern browsers (Chrome 90+, Firefox 88+, Edge, Safari). It should degrade gracefully on older browsers.
*   **NFR-17 (Hardware Independence):** The backend utilizes Node.js and Python, which are cross-platform. The system must run on Linux (Ubuntu/Debian preferred for production servers) and Windows (for local development).

#### **2.3.3.8 Usability**
*   **NFR-18 (Minimal Clicks):** The process to simple file a report should take no more than **3 steps** (Register -> Click Report -> Submit Form).
*   **NFR-19 (Responsiveness):** The user interface must utilize CSS Media Queries to adapt the layout for mobile screens (320px width), tablets (768px), and desktops.
*   **NFR-20 (Feedback):** Every action (e.g., clicking "Submit") must provide immediate visual feedback (e.g., a loading spinner) so the user knows the system is processing.

#### **2.3.3.9 Interoperability**
*   **NFR-21 (API First Design):** The backend must expose standard **RESTful API endpoints** (GET, POST, PUT, DELETE) responding in JSON format. This allows future integration with third-party systems, such as a police mobile app or an external NGO database.
*   **NFR-22 (Data Export):** Admin users should be able to export case data into standard formats like CSV or PDF for offline reporting and archival purposes.

## 2.4 User Characteristics and Assumptions

### 2.4.1 User Characteristics
Understanding the user base is vital for interface design.
*   **Citizen / Public User:**
    *   *Technical Proficiency:* Varied, from low to high.
    *   *Usage Frequency:* Low (likely one-time use during a crisis).
    *   *Requirement:* Simple, intuitive interface with clear instructions. No technical jargon.
*   **Police Administrator:**
    *   *Technical Proficiency:* Moderate (familiar with basic office software).
    *   *Usage Frequency:* Daily.
    *   *Requirement:* Efficiency, data density, keyboard shortcuts, and robust search tools.
*   **System Administrator:**
    *   *Technical Proficiency:* High (Developer/IT Specialist).
    *   *Role:* Maintenance, backups, and user management.

### 2.4.2 Assumptions and Dependencies
*   **Assumption 1:** It is assumed that the users (Police) will have continuous internet access at the station.
*   **Assumption 2:** It is assumed that the photos provided by families will be of reasonable quality (not excessively blurry or dark) for the AI to function.
*   **Dependency 1:** The system depends on the availability of the `DeepFace` library and its underlying pre-trained models (VGG-Face, FaceNet) staying open-source and compatible.
*   **Dependency 2:** The system relies on third-party cloud hosting providers (like Render or AWS) for server uptime.
