# System Architecture & Documentation

## 1. System Architecture Diagram

```mermaid
graph TD
    Client[Frontend Client (Browser)]
    Server[Node.js Express Backend]
    DB[(MongoDB Atlas)]
    AI[Python AI Service]
    Storage[Image Storage (Local/S3)]

    Client -- REST API (JSON) --> Server
    Server -- Mongoose --> DB
    Server -- Store Image --> Storage
    Server -- HTTP POST (Image) --> AI
    AI -- Return Embedding --> Server
    
    subgraph AI Service
    AI_Process[DeepFace / OpenCV]
    end
```

## 2. MongoDB Schema Design

### User Model
| Field | Type | Description |
|-------|------|-------------|
| `username` | String | Unique username |
| `email` | String | Unique email |
| `password` | String | Hashed password |
| `role` | String | `admin`, `law_enforcement`, `authorized_org`, `public_user` |
| `isVerified` | Boolean | For official accounts |

### MissingPerson Model
| Field | Type | Description |
|-------|------|-------------|
| `fullName` | String | Name of person |
| `status` | String | `Missing`, `Found`, `Deceased` |
| `images` | Array | List of image URLs |
| `faceEmbeddings` | Array[Number] | High-dimensional vector representing the face (Hidden by default) |
| `reportedBy` | ObjectId | Reference to User |
| `lastSeenLocation`| String | Location text |

## 3. AI Workflow
1.  **Preprocessing**: An uploaded image is received by the AI Service. `OpenCV` logic can be added to crop faces if multiple are present (Currently `DeepFace` handles basic detection).
2.  **Embedding Generation**: The image is passed through the `FaceNet` model. This converts the facial features into a 128-d (or similar) vector key.
3.  **Comparision**:
    - The backend calculates **Cosine Similarity** between the new vector and stored vectors.
    - `Similarity = (A . B) / (||A|| * ||B||)`
    - If similarity > 0.6 (Threshold), it is flagged as a match.

## 4. Security Considerations
- **Passwords**: Hashed using `bcryptjs`.
- **API Access**: Protected by JWT (JSON Web Tokens). Middleware ensures only authorized roles can access sensitive endpoints.
- **Data**: Sensitive biometric data (embeddings) is set to `select: false` in Mongoose, meaning it's only retrieved when explicitly requested for matching, not sending to the frontend.
