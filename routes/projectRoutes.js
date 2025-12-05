const express = require('express');
const router = express.Router();
const { 
    getAllProjects, 
    createProject,
    getProjectsByStatus,
    updateProjectStatus,
    getCategories, 
    getTechnologies, 
    linkTechnologies 
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const {restrictTo} = require('../middleware/roleMiddleware');


// === Data Fetching Routes (Needed by Frontend) ===
// 1. Get all categories
router.get('/categories', protect, getCategories); 

// 2. Get all technologies
router.get('/technologies', protect, getTechnologies); 


// === Public/Read Routes (Authenticated Users) ===
// 3. Get all projects
router.get('/', protect, getAllProjects); 

// 4. Get projects by status (e.g., /pending, /approved)
router.get('/:status', 
    protect, 
    restrictTo(['supervisor', 'admin']), 
    getProjectsByStatus
);


// === Submission Routes ===
// 5. Submit a new project (Frontend expects POST /api/projects)
router.post('/', 
    protect, 
    restrictTo(['student', 'supervisor', 'admin']), 
    createProject
);

// 6. Link technologies to the newly created project (Frontend's second POST call)
router.post('/project_technologies', 
    protect, 
    restrictTo(['student', 'supervisor', 'admin']), 
    linkTechnologies
);


// === Status Update Route (Approval/Rejection) ===
// 7. Update project status
router.put('/:id/status', 
    protect, 
    // FIX: Change role case to lowercase
    restrictTo(['supervisor', 'admin']), 
    updateProjectStatus
);

module.exports = router;