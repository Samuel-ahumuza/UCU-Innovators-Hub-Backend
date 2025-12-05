💡 UCU Innovators Hub Backend System

Overview

This repository contains the backend system for the UCU Innovators Hub project. It is built to manage user authentication (students and supervisors) and handle project submissions, status tracking, and administration.

The system is built using Node.js, Express, and Sequelize (ORM) for robust and scalable management of data.

🚀 Getting Started (Local Setup)

Follow these steps to set up and run the backend server on your local machine.

Prerequisites

Node.js & npm (Node Package Manager)

MySQL Database (A running instance of MySQL server)

1. Database Configuration

Create a new database in your MySQL instance (e.g., ucuinnovatorshub_db).

Create a file named .env in the root of the project directory.

NOTE: The .env file contains sensitive credentials and is ignored by Git for security. Do not commit this file.

Paste the following configuration into your .env file, replacing the placeholders with your actual credentials:

# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=ucuinnovatorshub_db
DB_DIALECT=mysql
DB_PORT=3306 

# Application Configuration
PORT=5000
NODE_ENV=development

# JWT Secret Key (Crucial for Authentication)
JWT_SECRET=YOUR_VERY_SECURE_SECRET_KEY_HERE
JWT_EXPIRES_IN=90d


2. Install Dependencies

Open your terminal in the project root directory and run:

npm install


3. Database Migration and Seeding

Before running the application, you must migrate the database schema and populate it with initial data (e.g., Administrator account, initial roles).

A. Run Migrations

Execute the Sequelize migration commands to create the necessary database tables:

npx sequelize-cli db:migrate


B. Seed Initial Data

Run the seeder commands to populate the Users table with initial credentials:

npx sequelize-cli db:seed:all


(You can check the seed files in the appropriate directory for default login credentials.)

4. Running the Server

Start the application in development mode using the command defined in package.json:

npm run dev


The server will be accessible at the address specified in your .env file (e.g., http://localhost:5000).

🔑 Key Features and Architecture

User Roles and Authentication

The system supports three distinct user roles, each with varying permissions enforced by JWT authorization middleware:

Role

Access Level

Responsibilities

Student

Basic

Project submission, viewing own submission status.

Supervisor

Elevated

Grading and providing feedback on assigned projects.

Admin

Full

User management, category management, system configuration, and overview of all submissions.

Project Submission and Integrity

The project submission endpoint is secured to guarantee data integrity:

JWT Enforcement: All submissions require a valid JSON Web Token for authentication.

Strict Ownership: The controller logic forces the SubmittedByID of the submitted project to match the ID of the authenticated user extracted directly from the verified JWT payload. This prevents unauthorized project misattribution.
