<div align="center">
  <h1>🌍 AVORA</h1>
  <p><b>A Secure & Feature-Rich Travel Diary Application</b></p>
  
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
</div>

<br />

**Avora** is a comprehensive MERN stack web application designed for users to securely store, organize, and share their travel experiences and memories. Built with a heavy focus on backend security, access control, and robust media management.

---

## ✨ Key Features

### 🔐 Advanced Security & Authentication
* **Robust Auth Flow:** Secure JWT-based authentication with encrypted password hashing (`bcryptjs`).
* **Global Session Invalidation:** Changing or resetting a password automatically updates `passwordChangedAt`, instantly invalidating all active sessions across every device.
* **Strict Rate Limiting:** Built-in protection against brute-force attacks with a strict 24-hour rate limiter on password reset requests.
* **Reliable Email Delivery:** Integrated with the **Resend API** (communicating over HTTPS Port 443) to guarantee reliable password reset delivery without cloud SMTP port blocks.

### 📸 Memory Management & UI
* **Travel Journals:** Full CRUD operations for creating, reading, updating, and deleting travel memories.
* **Cloud Media Uploads:** Seamless image uploads and scalable media handling powered by **Multer** and **Cloudinary**.
* **Responsive Design:** A sleek, modern user interface optimized for all devices.

### 🛡️ Administrative Control
* **Admin Approval Workflow:** New accounts require administrator approval before login, supporting account status management (`pending`, `approved`, `suspended`).
* **Role-Based Access Control (RBAC):** Distinct permissions, route guards, and restrictions for standard users vs. administrators.

---

## 🛠️ Technology Stack

| Frontend | Backend |
| :--- | :--- |
| React & Vite | Node.js & Express.js |
| Modern CSS / Responsive Design | MongoDB Atlas & Mongoose ODM |
| Hosted on **Vercel** | JSON Web Tokens (JWT) & bcryptjs |
| | Resend API (HTTP email service) |
| | Multer & Cloudinary |
| | Hosted on **Render** |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed. You will also need accounts for [MongoDB Atlas](https://www.mongodb.com/), [Cloudinary](https://cloudinary.com/), and [Resend](https://resend.com/).

### 1. Clone the repository
```bash
git clone [https://github.com/ResmalMubarakV/Avora.git](https://github.com/ResmalMubarakV/Avora.git)
cd Avora

2. Install Dependencies
Backend:

Bash
cd server
npm install
Frontend:

Bash
cd ../client
npm install
3. Environment Variables
Create a .env file in the server/ directory and configure the following variables:

Code snippet
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

# Email Service
RESEND_API_KEY=your_resend_api_key

# Media Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
4. Running the Application
Start the Backend Server:
Open a terminal in the root directory and run:

Bash
cd server
npm run dev
Start the Frontend Client:
Open a new terminal and run:

Bash
cd client
npm run dev


📂 Project Structure

Avora/
├── client/                 # Frontend React application
│   ├── src/
│   └── package.json
└── server/                 # Backend Express application
    ├── config/             # Database configuration (MongoDB)
    ├── constants/          # Reserved usernames and app constants
    ├── controllers/        # Route business logic (auth, memories, admin)
    ├── middleware/         # Security, rate limiters, and authentication guards
    ├── models/             # Mongoose schemas (User, Memory, etc.)
    ├── routes/             # API endpoint definitions
    ├── templates/          # HTML email templates
    ├── utils/              # Helper utilities (Resend email, validators)
    ├── server.js           # Express app entry point
    └── package.json
