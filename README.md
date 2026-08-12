# Avora

A feature-rich MERN stack travel diary and memory management web application designed for users to securely store, organize, and share their travel experiences.

---

## Features

- **Robust Authentication & Authorization:** Secure JWT-based authentication with encrypted password hashing (`bcryptjs`).
- **Admin Approval Workflow:** New accounts require administrator approval before login, supporting account status management (`pending`, `approved`, `suspended`).
- **Global Session Invalidation:** Changing or resetting a password automatically updates `passwordChangedAt`, instantly invalidating all existing active sessions across every device.
- **Secure HTTP Email Delivery:** Integrated with the **Resend API** (communicating over HTTPS Port 443) to guarantee reliable password reset delivery without cloud SMTP port blocks.
- **Advanced Rate Limiting:** Built-in protection against brute-force attacks with a strict 24-hour rate limiter on password reset requests.
- **Memory Management:** Full CRUD operations for creating, reading, updating, and deleting travel memories.
- **Media Uploads:** Seamless image uploads and media handling powered by **Multer** and **Cloudinary**.
- **Role-Based Access Control (RBAC):** Distinct permissions and restrictions for standard users and administrators.

---

## Tech Stack

### Frontend
- React
- Vite
- Modern CSS / Responsive Design
- Hosted on **Vercel**

### Backend
- Node.js
- Express.js
- MongoDB Atlas & Mongoose ODM
- JSON Web Tokens (JWT)
- Resend API (HTTP email service)
- Express Rate Limit
- Multer & Cloudinary
- Hosted on **Render**

---

## Project Structure 

```text
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

## Environment Variables

Create a `.env` file in the `server/` directory and configure the following variables:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=your_resend_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret


Installation & Setup
Clone the repository and install dependencies for both the server and client:

# Clone the repository
git clone [https://github.com/ResmalMubarakV/Avora.git](https://github.com/ResmalMubarakV/Avora.git)

# Navigate to server and install dependencies
cd server
npm install

# Navigate to client and install dependencies
cd ../client
npm install


Running the Application

Start the Backend Server
Bash
cd server
npm run dev

Start the Frontend Client
Bash
cd client
npm run dev