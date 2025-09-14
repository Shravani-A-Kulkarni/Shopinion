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

- **Frontend**: React.js / HTML, CSS, JavaScript
- **Backend**: Node.js (Express) or Python (Flask/Django)
- **Database**: MongoDB / MySQL / PostgreSQL
- **Authentication**: JWT or Session-based

## Project Structure

project-root/
├─ frontend/ # React or HTML views
├─ backend/ # Express or Flask server
├─ .gitignore
├─ README.md
└─ .env.example

## Setup Instructions

1. Clone the repo

   ```bash
   git clone https://github.com/Shravani-A-Kulkarni/Shopinion.git
   cd role-based-login-system

   ```

2. Install dependencies

   # Backend

   cd backend
   npm install

   # or for Python

   pip install -r requirements.txt

   # Frontend

   cd frontend
   npm install

3. Add .env file based on .env.example.

4. Run the app

   # Backend

   node server.js or npx nodemon server.js(auto updates)

   # Frontend

   npm start

## Roles & Dashboards

--Admin → Admin dashboard with user management

--Manager → Manager dashboard with limited control

--User → User dashboard with personal data

## License

MIT

## Author

Shravani Abhijit Kulkarni
