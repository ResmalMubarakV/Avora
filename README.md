# Avora

A MERN stack travel diary application where users can securely store and manage travel memories.

## Features

- User Authentication (JWT)
- Secure Login & Registration
- Upload Images to Cloudinary
- Create, Read, Update & Delete Memories
- Protected Routes
- MongoDB Atlas Integration
- Multer Image Upload
- Cloudinary Image Management

## Tech Stack

Frontend
- React
- Vite
- CSS

Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Cloudinary

## Status

Backend ✅ Completed

Frontend 🚧 In Progress

## Installation

```bash
git clone https://github.com/ResmalMubarakV/Avora.git

cd server
npm install

cd ../client
npm install
```

## Environment Variables

Create a `.env` file in `server/`:

```
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Run

```bash
cd server
npm run dev

cd client
npm run dev
```
