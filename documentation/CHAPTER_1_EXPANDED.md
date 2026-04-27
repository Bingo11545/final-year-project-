# CHAPTER ONE: INTRODUCTION

## 1.1 Background of the Project

In the modern era, the safety and security of citizens are paramount responsibilities for any society. One of the most distressing challenges faced by communities worldwide is the phenomenon of missing persons. The disappearance of an individual—whether a child, an adult, or an elderly person—creates an immediate crisis that ripples through families, communities, and law enforcement agencies. In Ethiopia, as in many developing nations, the traditional mechanisms for reporting and locating missing persons have largely relied on manual processes. These often involve physically visiting police stations, filing paper-based reports, distributing photocopied flyers, and relying on word-of-mouth or broadcast media which may have limited reach or expensive costs.

While these traditional methods have served a purpose, they are inherently limited by geography and speed. A physical poster can only be seen by people in that specific location, and a radio announcement is fleeting. The critical window of time immediately following a disappearance—often referred to in criminology as the "golden hours"—is frequently lost to bureaucratic delays and the slow dissemination of information. Furthermore, there is often a lack of coordination between different police stations and regions; a person reported missing in one city might be found in another without the local authorities realizing they are dealing with a reported case.

Concurrently, the world is witnessing a digital revolution. The proliferation of web technologies and the ubiquity of smartphones have transformed how information is shared. More importantly, the field of Artificial Intelligence (AI), specifically Computer Vision and Machine Learning (ML), has reached a level of maturity where it can be applied to solve real-world humanitarian problems. Facial recognition technology, once the domain of high-security government facilities, is now accessible for civilian safety applications.

This project, the "National Missing Persons System (EFP)," is born out of the necessity to bridge the gap between archaic reporting methods and modern technological capabilities. It proposes a centralized, web-based platform integrated with AI-powered facial recognition. By creating a unified digital database accessible to both the public and law enforcement, and by automating the identification process using Deep Learning algorithms, this project aims to create a robust safety net. It represents a shift from reactive, disjointed search efforts to a proactive, data-driven, and interconnected approach to finding missing citizens.

## 1.2 Statement of the Problem and Justification

### Statement of the Problem
Despite the best efforts of law enforcement and the community, the current system for handling missing person cases in the region is plagued by several critical inefficiencies:

1.  **Decentralized Data Silos:** Information regarding missing persons is often recorded in physical logbooks at local police stations. There is no centralized digital repository that connects these stations. Consequently, if a person goes missing in Addis Ababa and is found in Adama, police in Adama may have no immediate way of knowing the individual is searched for, leading to prolonged separation and resource wastage.
2.  **Inefficient Identification Processes:** Currently, the verification of a missing person’s identity relies heavily on visual memory or manual comparison of photographs. Officers must manually flip through binders of "wanted" or "missing" posters to match a found individual. This process is not only time-consuming but is also prone to significant human error, especially when dealing with large numbers of cases or aged photographs.
3.  **Limited Public Engagement Channels:** Citizens who wish to help often lack a direct, secure, and easy channel to provide tips. They may be hesitant to visit a police station due to distance or fear of bureaucracy. Valuable community intelligence is therefore often lost.
4.  **Slow Information Dissemination:** The time lag between a person being reported missing and the public being notified is often too long. In cases of abduction or wandering (e.g., individuals with dementia), every minute counts. Manual distribution of flyers is too slow to keep up with the urgency of the situation.

### Justification of the Project
The development of the EFP Missing Persons System is justified by its potential to drastically reduce the time taken to locate missing individuals. By digitizing the reporting process, we eliminate geographical barriers, ensuring that a report filed in one corner of the country is instantly visible nationwide.

Furthermore, the integration of the **DeepFace** AI framework provides a technological justification. DeepFace allows for the biometric analysis of facial features, creating mathematical embeddings that are unique to each individual. This allows the system to compare a photo of a "found" person against thousands of "missing" records in milliseconds—a feat impossible for human officers. 

Financially and socially, the project is justified by the reduction of investigative costs and the alleviation of the psychological trauma inflicted on families. A faster resolution to cases opens up police resources for other critical tasks and restores stability to affected families sooner.

## 1.3 Objective of the Project

### 1.3.1 General Objective
The primary general objective of this project is to design, develop, and deploy a comprehensive, AI-integrated web-based platform that centralizes the management of missing person cases, facilitates rapid public reporting, and utilizes advanced facial recognition algorithms to automate the identification and matching of missing individuals.

### 1.3.2 Specific Objectives
To achieve the general objective, the project focuses on the following specific goals:

1.  **To Develop a Centralized Database:** Design a robust MongoDB database architecture capable of securely storing diverse data types, including text-based demographic information (name, age, gender, last seen location) and binary image data for missing persons.
2.  **To Implement AI-Driven Facial Recognition:** specific integration of the `DeepFace` Python library (using models like FaceNet or VGG-Face) to extract facial embeddings from uploaded images and perform vector similarity searches to identify potential matches automatically.
3.  **To Create a User-Friendly Public Portal:** Develop an intuitive frontend interface (HTML, CSS, JavaScript) that allows ordinary citizens to register, report missing persons easily, view active cases, and submit anonymous tips without requiring technical expertise.
4.  **To Design an Administrative Dashboard:** Build a secure dashboard for law enforcement personnel to review incoming reports, validate case details, manage investigation statuses (e.g., Pending, Approved, Resolved), and oversee system data.
5.  **To Establish a Notification and Alert Mechanism:** Implement a system to provide visual cues or status updates to users when a match is found or when a case status changes, improving communication between the authorities and the public.
6.  **To Ensure Data Security and Privacy:** Implement industry-standard authentication (JWT - JSON Web Tokens) and password encryption (Bcrypt) to protect sensitive user data and ensure that only authorized personnel can modify critical case information.

## 1.4 Scope of the Project

The scope of the project defines the boundaries of the system, outlining what will be delivered in the final product.

*   **Functional Scope:**
    *   **User Module:** Registration, Login, Report Missing Person (w/ Image Upload), View Reports, Search/Filter Reports, Submit Tips.
    *   **Admin/Police Module:** Login, Dashboard Overview, Approve/Reject Reports, Update Case Status, View Tips, Manage Users.
    *   **AI Module:** Image Pre-processing (OpenCV), Face Detection, Face Verification/Recognition (DeepFace), Returning Match Confidence Scores.
*   **Data Scope:** The system will handle textual data (descriptions, locations, dates) and multimedia data (images of missing persons). It focuses on the specific domain of "Missing Persons" and does not extend to criminal record management or other police databases.
*   **Geographical Scope:** While the system is web-based and technically accessible globally, the project context is designed for national use within Ethiopia. The piloting phase will focus on accurate data collection and matching within a controlled test environment.
*   **Technical Scope:** The system is built as a Full-Stack Web Application.
    *   **Frontend:** Standard Web Technologies (HTML5, CSS3, JavaScript).
    *   **Backend:** Node.js environment with Express.js framework.
    *   **AI Service:** Python Microservice using Flask.
    *   **Database:** MongoDB (NoSQL).

## 1.5 Limitation of the Project

Despite the comprehensive design, the project inevitably faces certain limitations:

1.  **Dependency on Image Quality:** The core AI functionality relies on the quality of images provided. Low-resolution, blurry, or occluded images (e.g., wearing masks or sunglasses) may significantly reduce the accuracy of the facial recognition model, leading to false negatives.
2.  **Hardware Resource Intensity:** Running deep learning models for face recognition is computationally expensive. The `DeepFace` library requires significant RAM and CPU power. In a production environment with concurrent users, this could lead to latency or server costs that are higher than a standard text-based web app.
3.  **Internet Connectivity Requirement:** As a web-based cloud solution, the system becomes inaccessible in areas with no internet connection. This is a significant limitation in remote rural areas where potential sightings might occur but cannot be reported instantly.
4.  **The "Cold Start" Problem:** The system's effectiveness is directly proportional to the amount of data in it. Initially, with few records, the matching capability will be limited until critical mass is achieved in population data.
5.  **Aging and Facial Changes:** The current AI model may struggle to match a person if the reference photo is very old (e.g., a childhood photo of an adult). Accounting for significant age progression is beyond the scope of this specific iteration.

## 1.6 System Development Methodology

### 1.6.1 System Development Approach
This project utilizes the **Agile Software Development Methodology**. Unlike the rigid Waterfall model, Agile allows for flexibility and iterative progress. The development is broken down into small, manageable cycles or "sprints."

*   **Phase 1: Planning and Analysis:** Gathering requirements from stakeholders (conceptually), defining the schema for the Missing Person and User models, and selecting the technology stack.
*   **Phase 2: Design:** Creating wireframes for the user interface (UI) and designing the system architecture (breaking down the Node.js backend vs. the Python AI service).
*   **Phase 3: Implementation (Iterative):**
    *   Sprint 1: Setting up the Backend API and Database.
    *   Sprint 2: Developing the Frontend pages (Report, Dashboard).
    *   Sprint 3: Integration of the AI Python script with the Node.js server.
*   **Phase 4: Testing:** Conducting unit tests on individual routes and integration tests to ensure the image upload correctly triggers the AI recognition.
*   **Phase 5: Deployment & Maintenance:** Hosting the application on platform-as-a-service providers like Render and Netlify.

### 1.6.2 System Development Tools

The selection of tools was driven by the need for a modern, scalable, and efficient stack (MERN + Python).

**A) Programming Languages**
*   **JavaScript (Node.js):** Used as the primary server-side language. Its non-blocking I/O model makes it excellent for handling concurrent requests in the API.
*   **Python:** Selected for the AI component. Python is the de-facto standard for Data Science and Machine Learning, offering rich libraries for computer vision.
*   **HTML5 / CSS3:** The standard languages for structuring and styling the web interface.

**B) AI and Machine Learning Tools**
*   **DeepFace:** A lightweight, hybrid face recognition framework for Python. It acts as a wrapper for state-of-the-art models (VGG-Face, Google FaceNet, OpenFace). It simplifies the complex task of facial verification into a few lines of code.
*   **OpenCV (Open Source Computer Vision Library):** Used for image pre-processing, such as reading image files, resizing, and color conversion before they are fed into the neural network.
*   **TensorFlow:** The underlying open-source machine learning platform that powers the deep learning models used by DeepFace.

**C) Database Management System**
*   **MongoDB:** A NoSQL database was chosen over SQL databases (like MySQL) because of its flexibility. The data structure for a "Missing Person" (which includes arrays of tips, various image URLs, and potentially unstructured descriptions) fits well into MongoDB's JSON-like document format.

**D) Development Frameworks**
*   **Express.js:** A minimal and flexible Node.js web application framework used to build the robust RESTful API. It simplifies routing and middleware integration.
*   **Flask:** A micro web framework for Python. It is used to wrap the DeepFace script into an API endpoint so the Node.js backend can communicate with the AI logic via HTTP requests.

**E) Development Environment and Tools**
*   **Visual Studio Code (VS Code):** The primary code editor, chosen for its excellent extension support for both JavaScript and Python.
*   **Postman:** Used for testing API endpoints (GET, POST, PUT, DELETE) during development before the frontend was ready.
*   **Git & GitHub:** Used for version control to track changes and manage source code history.

**F) Hardware Requirements**
*   **Development Machine:** Intel Core i5/i7 Processor, 16GB RAM (recommended for running ML models locally), 256GB SSD.
*   **Server/Hosting:** Cloud instance with support for Python 3.8+ and Node.js 18+.

## 1.7 Significance of the Project

The "National Missing Persons System" holds significant value for various sectors of society:

1.  **Humanitarian Impact:** At its core, the project saves lives and preserves families. By speeding up the location process, it mitigates the high risk of trafficking, injury, or death that accompanies prolonged disappearances.
2.  **Modernizing Police Operations:** For the police force, this system represents a leap into digital policing. It reduces administrative overhead (paperwork) and allows officers to focus on investigation rather than data entry. The AI component acts as a force multiplier, doing the work of dozens of officers in matching photos.
3.  **Community Empowerment:** The system democratizes the search process. By giving citizens a tool to report sightings simply and anonymously via standard web forms, it fosters a sense of community responsibility and civic duty.
4.  **Academic and Technological Contribution:** This project serves as a practical demonstration of how advanced AI concepts can be applied to local contexts in Ethiopia. It contributes to the growing body of work regarding "AI for Social Good."

## 1.8 Beneficiaries of the project

1.  **Families and Relatives of Missing Persons:** The most direct beneficiaries. They gain a platform to amplify their voice and a tool that works tirelessly to find their loved ones.
2.  **Law Enforcement Agencies (Police Commission):** They benefit from centralized data, automated matching, and better case management tools.
3.  **Vulnerable Groups (Children, Elderly, Mentally Ill):** These groups are most at risk of going missing. A system that can identify a confused elderly person or a lost child quickly is a direct safeguard for them.
4.  **Non-Governmental Organizations (NGOs):** Organizations working with homeless populations or trafficking victims can use the system to identify individuals in their care who might be reported missing elsewhere.

## 1.9 Feasibility Study

A feasibility study determines if the project is viable.

*   **Technical Feasibility:** The project is technically feasible. The team possesses the necessary skills in JavaScript and Python. The required technologies (DeepFace, MongoDB, Node.js) are open-source, well-documented, and mature. The integration of Python and Node.js via HTTP APIs is a standard architectural pattern.
*   **Operational Feasibility:** The system is designed with a focus on User Experience (UX). The interface is simple enough that citizens with basic digital literacy can use it. Police officers can optionally be trained in a short session. Therefore, the system is operationally viable.
*   **Economic Feasibility:** The project is cost-effective. Being built on open-source software means there are no expensive licensing fees. The initial costs are limited to hosting (which can start on free tiers like Render/Netlify) and domain registration. The long-term maintenance cost is low compared to the operational cost of manual police searches.

## 1.10 Project Schedule

The project timeline was structured to ensure all phases were completed efficiently within the academic semester.

| Phase | Activity | Duration | Deliverable |
| :--- | :--- | :--- | :--- |
| **1** | **Requirement Gathering** | Week 1-2 | Project Proposal, SRS Document |
| **2** | **System Analysis & Design** | Week 3-4 | Use Case Diagrams, DFDs, ER Diagrams |
| **3** | **Database & API Implementation** | Week 5-7 | Functional Backend, Database Schema |
| **4** | **AI Service Development** | Week 8-9 | Python Flask Service, Face Recognition Logic |
| **5** | **Frontend Development** | Week 10-12 | Responsive UI, Integration with APIs |
| **6** | **Testing & Debugging** | Week 13-14 | Bug Reports, Optimized Code |
| **7** | **Documentation & Final Presentation** | Week 15 | Final Report, Slide Deck |

## 1.11 Project Budget

While this is an academic project, a hypothetical budget for a real-world pilot deployment has been estimated.

| No. | Item Description | Unit | Quantity | Unit Price (ETB) | Total Price (ETB) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Domain Registration (.et)** | Year | 1 | 600.00 | 600.00 |
| 2 | **Cloud Hosting (VPS Standard)** | Month | 6 | 1,500.00 | 9,000.00 |
| 3 | **Internet Data / Communication** | Month | 4 | 1,000.00 | 4,000.00 |
| 4 | **Documentation & Printing** | Pcs | 3 | 500.00 | 1,500.00 |
| 5 | **Contingency Fund (10%)** | - | - | - | 1,510.00 |
| | **Grand Total** | | | | **16,610.00 ETB** |
