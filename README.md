# Role-Based Login System

## Overview

This project implements a **Login System with Role-Based Dashboard** access.  
Different types of users (e.g., Admin, User, Manager) see different dashboards after logging in.

## Features

- Secure login system
- Role-based authentication & authorization
- Separate dashboards depending on user role
- Session/token-based authentication
- Logout functionality

## Tech Stack

- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: MySQL
- **Authentication**: JWT

## Project Structure

project-root/
│-- backend/ # API & authentication logic
│-- frontend/ # React frontend
│-- screenshots/ # Project images
│-- .gitignore
│-- README.md
|-- .env.example

## Project UI

### Home Page

![Home Page](screenshots/HomePage.png)

### About Us

![About us Page](screenshots/AboutUs.png)

### Sign Up

![Sign up Page](screenshots/SignUp.png)

### Login

![Login Page](screenshots/Login.png)

### Admin Dashboard

1. ![Admin Dashboard Page](screenshots/AdminDashboard.png)
2. Admin can add different filters
   ![Admin Dashboard Page](screenshots/AdminFilter.png)
3. Admin can add user
   ![Admin Dashboard Page](screenshots/AdminAddUser.png)
4. Admin can add store
   ![Admin Dashboard Page](screenshots/AdminAddStore.png)

### Owner Dashboard

![Owner Dashboard Page](screenshots/OwnerDashboard.png)

### User Dashboard

![User Dashboard Page](screenshots/UserDashboard.png)
User can update password
![User Dashboard Page](screenshots/UserChangePassword.png)

## Setup Instructions

1. Clone the repo

   ```bash
   git clone https://github.com/Shravani-A-Kulkarni/Shopinion.git
   cd Shopinion

   ```

2. Install dependencies

   ### Backend

   cd backend
   npm install

   ### Frontend

   cd frontend
   npm install

3. Add .env file based on .env.example.

4. Run the app

   ### Backend

   node server.js or npx nodemon server.js(auto updates)

   ### Frontend

   npm start

## Roles & Dashboards

--Admin → Admin dashboard with user management

--Manager → Manager dashboard with limited control

--User → User dashboard with personal data

## License

MIT

## Author

Shravani Abhijit Kulkarni
