# 💡 UCU Innovators Hub Backend System

## Overview

This repository contains the backend system for the UCU Innovators Hub project. It is built to manage user authentication (students and supervisors) and handle project submissions, status tracking, and administration.

The system is built using **Node.js, Express, and Sequelize (ORM)** for robust and scalable management of data.

---

## 🚀 Getting Started (Local Setup)

Follow these steps to set up and run the backend server on your local machine.

### Prerequisites

* **Node.js & npm** (Node Package Manager)
* **MySQL Database** (A running instance of MySQL server)

### 1. Database Configuration

1.  Create a new database in your MySQL instance (e.g., `ucuinnovatorshub_db`).
2.  Create a file named **`.env`** in the root of the project directory.

    **NOTE:** The `.env` file contains sensitive credentials and is **ignored** by Git for security.

3.  Paste the following configuration into your `.env` file, replacing the placeholders with your actual credentials:

    ```
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
    ```

### 2. Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm install
