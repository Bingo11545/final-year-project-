# CHAPTER SIX: CONCLUSION AND RECOMMENDATION

## 6.1 Conclusion

The development of the **AI-Integrated Missing Person Finder** represents a significant step forward in modernizing the approach to locating missing individuals. By identifying the critical limitations of the existing manual, paper-based systems—such as data fragmentation, slow response times, and the unreliability of human visual memory—this project successfully designed and implemented a digital solution to address these challenges.

To achieve the project objectives, a comprehensive system was built using the **MERN Stack** (MongoDB, Express, React, Node.js) for robust web application management and **DeepFace (Python)** for advanced facial recognition capabilities. The successful integration of these technologies demonstrates that it is possible to automate the complex task of identity verification with a high degree of accuracy and efficiency.

The system effectively centralizes missing person records into a secure, searchable database, allowing for real-time data sharing across different locations. The implementation of the AI-based "Search by Image" feature drastically reduces the time required to match a found person/sighting with reported cases, potentially saving investigations that would otherwise turn into cold cases. Furthermore, the user-friendly interface empowers the general public to participate actively in investigations by submitting reports and tips in a structured manner.

In conclusion, this project has proven that integrating Artificial Intelligence into humanitarian services is not only feasible but highly impactful. The system meets its core functional requirements of reporting, storing, and identifying missing persons, providing a solid foundation for a national-level solution that can significantly improve recovery rates and public safety.

## 6.2 Recommendation

While the current system successfully functions as a working prototype, several recommendations are proposed for future development and large-scale deployment:

1.  **Integration with National ID and Surveillance Systems:**
    To maximize effectiveness, it is recommended that the system be integrated with existing National ID databases and eventually, with public surveillance camera networks (CCTV). This would allow for passive, real-time scanning of missing persons in crowded public spaces, moving beyond the current reactive model of user-initiated uploads.

2.  **Development of a Native Mobile Application:**
    Currently, the system is a web-based application. Developing a native mobile app (Android/iOS) with push notification capabilities would significantly enhance user engagement. Features such as "Geo-fencing" alerts could notify users when a child goes missing in their specific neighborhood.

3.  **Enhancement of AI Capability:**
    The current face recognition model relies on standard datasets. It is recommended to fine-tune the model specifically on local demographic datasets to improve accuracy for diverse skin tones and facial structures. Additionally, implementing "Age Progression" algorithms would assist in identifying individuals who have been missing for several years.

4.  **Hardware Infrastructure Upgrade:**
    For nationwide deployment, the system would require high-performance GPU servers to handle the computational load of processing thousands of images simultaneously. Investing in scalable cloud infrastructure is essential for production use.

5.  **Public Awareness and Training:**
    Technology alone cannot solve the problem. It is recommended that law enforcement agencies conduct training programs for officers on how to utilize digital tools effectively. Simultaneously, public awareness campaigns should encourage citizens to use the platform for reporting rather than relying solely on social media posts.

## References

1.  **Sefik Ilkin Serengil, Alper Ozpinar**, "LightFace: A Hybrid Deep Face Recognition Framework", *2020 Innovations in Intelligent Systems and Applications Conference (ASYU)*, Istanbul, Turkey, 2020.
2.  **MongoDB Inc.**, "The Little MongoDB Book", *Open Source Manual*, 2019. Available: https://github.com/karlseguin/the-little-mongodb-book
3.  **Brown, E.**, "Web Development with Node and Express: Leveraging the JavaScript Stack", *O'Reilly Media*, 2nd Edition, 2019.
4.  **National Crime Information Center (NCIC)**, "Missing Person File Data Collection Entry Guide", *FBI Criminal Justice Information Services Division*, 2021.
5.  **Taigman, Y., Yang, M., Ranzato, M., & Wolf, L.**, "DeepFace: Closing the Gap to Human-Level Performance in Face Verification", *Conference on Computer Vision and Pattern Recognition (CVPR)*, 2014.
6.  **React Documentation**, "Components and Props", *Facebook Open Source*. Available: https://reactjs.org/docs/components-and-props.html [Accessed: Jan 2024].

## Appendix

### Appendix A: Install Dependencies
To run the system locally, the following commands were used to install the necessary libraries.

**Backend (Node.js):**
```bash
npm install express mongoose dotenv cors jsonwebtoken bcrypt multer nodemailer
```

**AI Service (Python):**
```bash
pip install deepface flask flask-cors tf-keras opencv-python
```

### Appendix B: Sample Code (Face Detection)
The following snippet demonstrates how the Python service detects a face before generating an embedding.

```python
from deepface import DeepFace

def verify_image(img_path):
    try:
        # Attempt to detect face
        obj = DeepFace.extract_faces(
            img_path = img_path, 
            detector_backend = 'retinaface'
        )
        return len(obj) > 0
    except ValueError:
        return False
```

### Appendix C: Questionnaire for Requirement Gathering
*(Sample questions used during interviews with police officers)*
1.  How do you currently record the physical description of a missing person?
2.  What is the average time taken to distribute a "Missing" poster to other stations?
3.  Do you have access to a central database for cross-checking names?
4.  What is the biggest challenge when verifying a public tip?
5.  Would you trust a computer system to suggest potential matches?
