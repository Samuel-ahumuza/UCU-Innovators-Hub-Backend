const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Get database connection and models
const { connectDB, sequelize } = require('./config/database');
const models = require('./models'); // Loads all models and associations

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
// Use body-parser for parsing application/json and application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for frontend connection (replace with specific origin in production)
app.use(cors({
    origin: 'http://localhost:8080', 
    credentials: true,
}));

// --- ROUTES ---
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

app.use('/api/auth', authRoutes); // Should load fine
app.use('/api/projects', projectRoutes); // <--- CRASH POINT: Make sure this is a function (router)

app.get('/', (req, res) => {
    res.send('Project Repository Backend is running.');
});

// --- SERVER STARTUP ---
const startServer = async () => {
    // 1. Connect to the database
    await connectDB();
    
    // 2. Sync models with the database (creates tables if they don't exist)
    await sequelize.sync(); 
    console.log("Database synced successfully.");

    // 3. Start the Express server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();