# Chapter 1: Introduction

## 1.1 Background of the Project

The issue of missing persons is a profound global concern that touches families and communities deeply. In Ethiopia, as in many parts of the world, the traditional methods of locating missing individuals often rely heavily on manual reporting, physical bulletin boards, and word-of-mouth dissemination. While these methods have served their purpose, they are often slow, geographically limited, and prone to communication gaps. The initial hours after a disappearance are critical, and the lack of a centralized, rapid-response mechanism can significantly hamper search efforts.

With the advent of web technologies and Artificial Intelligence (AI), there is an opportunity to revolutionize this process. Digital platforms can bridge the gap between law enforcement, the public, and families. This project, the "National Missing Persons System (EFP)," integrates modern web development with facial recognition technology to create a centralized database. By automating the matching process and broadening the reach of missing person reports, we can significantly reduce response times and increase the likelihood of reunification.

## 1.2 Statement of the Problem and Justification

**Statement of the Problem:**
The current landscape for reporting and finding missing persons in the region faces several challenges:
1.  **Fragmentation:** Information is often siloed in local police stations or scattered social media posts, making it difficult to search comprehensively.
2.  **Manual Verification:** Law enforcement and citizens must manually compare photos against existing reports, a process that is time-consuming and prone to human error.
3.  **Slow Dissemination:** Physical posters and local announcements have limited reach and travel slowly compared, failing to utilize the instant nature of the internet.
4.  **Lack of Feedback Loop:** Citizens who submit tips often do not know if their information was received or useful, discouraging future participation.

**Justification:**
This project is justified by the urgent need for a more efficient, technology-driven solution. By implementing a centralized web platform accessible to both the public and police, we remove geographical barriers. The integration of AI-driven facial recognition specifically addresses the bottleneck of manual verification by instantly comparing uploaded images against a database of known missing persons. This system not only modernizes the search process but potentially saves lives by expediting the discovery process.

## 1.3 Objective of the Project

### 1.3.1 General Objective
The primary objective of this project is to design and develop an AI-integrated web-based platform that facilitates the efficient reporting, searching, and identification of missing persons to support families and law enforcement agencies.

### 1.3.2 Specific Objectives
1.  To develop a unified database for storing missing person profiles, including demographic data and photographs.
2.  To implement a secure authentication system for different user roles (Public, Admin/Police).
3.  To integrate an AI-powered face recognition service using DeepFace to automatically match uploaded images with database records.
4.  To create a user-friendly frontend interface for reporting cases, viewing active cases, and submitting anonymous tips.
5.  To provide a dedicated dashboard for law enforcement to manage cases, review tips, and update investigation statuses.
6.  To enable real-time notifications (or status updates) to keep stakeholders informed about case progress.

## 1.4 Scope of the Project
The project scope covers the full-stack development of the "National Missing Persons System".
*   **Geographical Scope:** Designed for nationwide use but piloted with a focus on specific regions/cities.
*   **Functional Scope:**
    *   **Public User:** Can view cases, report missing persons (with temporary approval), and submit tips.
    *   **Police/Admin:** Can approve reports, manage case statuses (Open, Found, Closed), and modify system data.
    *   **AI Service:** capable of generating facial embeddings and verifying identity matches.
*   **Technical Scope:** A MERN-stack based web application (MongoDB, Express, React/Vanilla JS, Node.js) with a Python-Flask microservice for DeepFace processing.

## 1.5 Limitation of the Project
1.  **Image Quality Dependence:** The accuracy of the AI facial recognition is heavily dependent on the quality and lighting of the uploaded photos.
2.  **Internet Connectivity:** As a web-based system, it requires users and police stations to have reliable internet access.
3.  **Hardware Resources:** The AI component requires significant server resources (RAM/CPU) for processing, which may limit performance on low-end hosting plans.
4.  **Adoption Rate:** The system's effectiveness relies on widespread public adoption and consistent data entry by authorities.

## 1.6 System Development Methodology

### 1.6.1 System Development Approach
This project follows the **Agile Development Methodology**. This approach allows for iterative development, where the project is broken down into small, manageable units called sprints (e.g., authentication, database design, AI integration). It enables continuous feedback and flexibility to adapt to changes during the development lifecycle.

### 1.6.2 System Development Tools
(As detailed in the previous response)

**A) Programming Languages:** JavaScript (Node.js, Browser), Python, HTML5, CSS3.
**B) AI and Machine Learning Tools:** DeepFace, OpenCV, TensorFlow/Keras, NumPy.
**C) Database Management System:** MongoDB (NoSQL).
**D) Development Frameworks:** Express.js (Backend), Flask (AI Microservice).
**E) Development Environment:** VS Code, Git/GitHub, Postman (API Testing).
**F) Hardware Requirements:** Server with Multi-core CPU and ~8GB+ RAM for AI processing.

## 1.7 Significance of the Project
1.  **Social Impact:** Provides hope and a proactive tool for families experiencing the trauma of a missing loved one.
2.  **Law Enforcement Efficiency:** Reduces the administrative burden on police by automating initial data collection and image matching.
3.  **Community Engagement:** Empowers citizens to be active participants in public safety by easily submitting tips.
4.  **Technological Advancement:** Demonstrates the practical application of AI in solving real-world humanitarian problems within the local context.

## 1.8 Beneficiaries of the Project
1.  **Families of Missing Persons:** The primary beneficiaries, gaining a wider platform to search for their loved ones.
2.  **Police and Law Enforcement:** Gaining a centralized tool to manage cases and leads more effectively.
3.  **The General Public:** Gaining a safer community and a simplified way to help others.
4.  **Social Service Organizations:** NGOs and shelters can use the system to cross-reference individuals in their care.

## 1.9 Feasibility Study
*   **Technical Feasibility:** proven by the availability of robust open-source libraries (DeepFace, Express) and the developer's proficiency in these tools.
*   **Operational Feasibility:** The interface is designed to be intuitive, requiring minimal training for users. Web access is increasingly common.
*   **Economic Feasibility:** The project utilizes open-source technologies, minimizing software licensing costs. Hosting costs are scalable based on usage.

## 1.10 Project Schedule
(Example Schedule - Adjust dates as per your actual timeline)
*   **Month 1:** Requirement gathering and System Analysis.
*   **Month 2:** System Design (Database schema, UI wireframes).
*   **Month 3:** Backend Development (API setup, Database connection).
*   **Month 4:** AI Service Development and Integration.
*   **Month 5:** Frontend Development and integration with APIs.
*   **Month 6:** Testing (Unit testing, System testing) and Debugging.
*   **Month 7:** Documentation and Final Deployment.

## 1.11 Project Budget
(Estimated Budget for a Final Year Project prototype)

| Item | Description | Estimated Cost (ETB/USD) |
| :--- | :--- | :--- |
| **Development Hardware** | Personal Laptop (Existing) | 0.00 |
| **Hosting Service** | Cloud Hosting (e.g., Render/Heroku Tier) | ~ $7.00 / month |
| **Domain Name** | .com or .et domain registration | ~ $15.00 / year |
| **Internet Data** | Development and Research connectivity | ~ 1,500 ETB |
| **Miscellaneous** | Printing, Binding, Stationery | ~ 800 ETB |
| **Total** | | **Variable** |
