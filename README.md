# 📓 Memories App

A full-stack MERN (MongoDB, Express, React, Node.js) web application where users can register, log in, and manage personal memories with images. Includes admin control panel, search, pagination, and cloud-based image storage.

---

## 🌐 Live Demo

- **Frontend (Netlify)**: [https://mymemoriesp.netlify.app/]
- **Backend (Render)**: [https://mymemories-qrkc.onrender.com/]

---

## 🚀 Features

### 👥 Authentication

- **Login Page**: Users & admins can log in.
- **Register Page** (User only):
  - Profile Image (with preview)
  - Full Name
  - Email
  - Password
  - Default role: `user`

### 🧑 User Functionality

- **View All Memories**
  - Paginated view
  - Scroll or navigation between pages
- **Add Memory**
  - Image + Description
- **Memory Detail Page**
  - Shows full memory info
  - Includes **Edit** and **Delete** options
- **Search Memory**
  - Real-time memory search by title
- **Profile Dropdown in Header**
  - Profile Picture
  - Options:
    - **View Profile**
    - **Logout**
- **Profile Page**
  - View personal info
  - Edit Profile
  - Delete Account

### 👨‍💼 Admin Functionality

- **Admin Login**
- **Admin Dashboard**
  - Table listing all users
  - Displays:
    - Full Name
    - Email
    - Number of memories created
    - Delete User option
- **Same Header Dropdown**:
  - Profile
  - Logout

---

## 🔎 Tech Stack

### Frontend
- React.js (Hooks, Context API)
- Axios
- React Router
- Netlify Deployment

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- Multer (for file uploads)
- Cloudinary (image storage)
- Render Deployment

---

## 🛠 Tools & Integrations

- 🔐 **JWT** – Secure authentication and authorization
- ☁️ **Cloudinary** – Stores all profile and memory images
- 🖼️ **Multer** – Handles form-data and image uploads
- 🔎 **Search** – Find specific memories instantly
- 📄 **Pagination** – Efficient memory listing page-by-page

---

## 📂 Project Structure

```bash
├── client (React frontend)
│ ├── src
│ │ ├── components
│ │ ├── pages
│ │ ├── styles
│ │ └── App.js
│ └── ...
├── server (Express backend)
│ ├── controllers
│ ├── middleware
│ ├── models
│ ├── routes
│ └── index.js
├── .env
└── README.md
```

---

## 📦 Installation & Running Locally

### Prerequisites

- Node.js, npm
- MongoDB
- Cloudinary account

### Clone the project

```bash
git clone https://github.com/yourusername/memories-app.git
cd memories-app
```

### Backend Setup (/backend)

```bash
cd backend
npm install
```

### Create .env file in /server:

```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

### Run the backend:
```bash
npm run dev
```

### Frontend Setup (/memories)
```bash
cd ../memories
npm install
```

### Start the frontend:
```bash
npm run dev
```

## 📌 Future Improvements
- Dark Mode toggle
- Password reset via email
- Admin: View/edit individual memories
- Loading spinners and toast notifications

### 🙋‍♂️ Author
Hekkadka Tanmai

📧 Email: htanmai.23@gmail.com

📍 Location: Hyderabad, Telangana


### 📜 License
Licensed under the MIT License.


