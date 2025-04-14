# 🌿 Ceylon Organics – Backend API

[![API Live](https://img.shields.io/badge/Live-Railway-blue)](https://ceylon-organic-back-end-production.up.railway.app/api/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://www.mongodb.com/)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Status](https://img.shields.io/badge/Project-Active-success)

> RESTful API built with Node.js and Express.js to support the **Ceylon Organics** e-commerce frontend.

---

## 🚀 API Features

- 🧑 User Authentication with JWT
- 📦 Product CRUD operations
- 🗂️ Category CRUD operations
- 🔐 Secure routes using middleware
- 🌍 CORS + dotenv + validation

---

## 📦 Tech Stack

| Category        | Tech Used                      |
|-----------------|--------------------------------|
| Runtime         | Node.js                        |
| Server          | Express.js                     |
| Auth            | JSON Web Tokens (JWT)          |
| Database        | MongoDB Atlas (via Mongoose)   |
| Hosting         | Railway                        |
| Middleware      | Express Middleware, CORS       |
| Tools           | dotenv, bcryptjs, morgan       |

---

## 🌐 API URL

Base URL:  
`https://ceylon-organic-back-end-production.up.railway.app/api/`

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/products`       | Fetch all products       |
| POST   | `/products`       | Add a new product        |
| PUT    | `/products/:id`   | Update a product         |
| DELETE | `/products/:id`   | Delete a product         |
| POST   | `/auth/register`  | Register user            |
| POST   | `/auth/login`     | Login and get token      |
| GET    | `/categories`     | Get all categories       |
| POST   | `/categories`     | Add new category         |

> Most routes require Authorization header with `Bearer <token>`.

---

## 🏗️ Project Structure

/backend 
├── controllers/ 
├── models/ 
├── routes/ 
├── middleware/ 
├── config/ 
├── .env 
├── server.js 
└── package.json


---

## 🔧 Getting Started Locally

1. **Clone the repo**
```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_BACKEND_REPO.git
    cd YOUR_BACKEND_REPO
```


2. **Install dependencies**
```bash
    npm install
```

3. **Create a .env file**
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. Run the server
```bash
npm run dev
```

---

🔐 Authentication
- JWT-based authentication system.
- Passwords are hashed using bcryptjs.
- Protected routes check for valid tokens.

---

🌱 Future Improvements
- 📦 Order management system
- 📊 Admin analytics dashboard
- 🔔 Add rate limiter to APIs
- ✉️ Add email notifications
- ✅ Add tests with Jest or Mocha

🙋‍♂️ Author
Built by Binod Perera with ❤️

Frontend: https://github.com/BinodPerera/Ceylon-Organic-Front-End
Live Site: https://ceylon-organic-front-end.vercel.app
