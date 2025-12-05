const asyncHandler = require('express-async-handler');
const { Projects, User, Categories, Faculty } = require('../models/index'); // NOTE: Added Faculty model
const { Op } = require('sequelize');

// Utility to define models to include in queries
const includeModels = [
    {
        model: User,
        as: 'SubmittedBy', 
        attributes: ['id', 'username', 'email', 'role', 'FacultyId'], // Ensure FacultyId is included
    },
    {
        model: Categories,
        as: 'Category', 
        attributes: ['id', 'name'],
    },
    {
        model: Faculty, // Include Faculty model
        as: 'Faculty', 
        attributes: ['id', 'name'],
    },
];


// @desc 	Get all approved projects (Public route for all users)
// @route 	GET /api/projects
// @access 	Public
const getAllProjects = asyncHandler(async (req, res) => {
    try {
        const projects = await Projects.findAll({
            where: { status: 'Approved' }, // Only show approved projects publicly
            include: includeModels,
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching public projects:', error);
        res.status(500).json({ message: 'Failed to retrieve public projects.' });
    }
});

// @desc 	Get projects filtered by status (Admin/Supervisor only)
// @route 	GET /api/projects/review/:status (e.g., /api/projects/review/pending)
// @access 	Private (Supervisor/Admin only)
const getProjectsByStatus = asyncHandler(async (req, res) => {
    const requestedStatus = req.params.status;
    
    const status = requestedStatus.charAt(0).toUpperCase() + requestedStatus.slice(1).toLowerCase();

    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status requested.' });
    }
    
    try {
        const projects = await Projects.findAll({
            where: { status: status },
            include: includeModels,
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(projects);
    } catch (error) {
        console.error(`Error fetching projects with status ${status}:`, error);
        res.status(500).json({ message: `Failed to retrieve projects with status ${status}.` });
    }
});


// @desc 	Create a new project
// @route 	POST /api/projects
// @access 	Private (Student/Supervisor/Admin)
const createProject = asyncHandler(async (req, res) => {
    const submittedById = req.user.id;
    const requiredYear = new Date().getFullYear(); // Use current year
    
    const { 
        title, 
        description, 
        categoryId, // Fixed: Using camelCase
        githubLink, // Fixed: Using camelCase
        demoLink,   // Fixed: Using camelCase
        documentUrl, // Fixed: Using camelCase
    } = req.body;

    if (!title || !description || !categoryId || !documentUrl) {
        return res.status(400).json({ message: 'Please include title, description, category ID, and document URL.' });
    }

    try {
        // --- FIX: Fetch the user and their associated FacultyId ---
        const submittingUser = await User.findByPk(submittedById, {
            attributes: ['id', 'FacultyId'] 
        });

        if (!submittingUser || !submittingUser.FacultyId) {
             console.error(`User ID ${submittedById} is missing Faculty ID.`);
             return res.status(403).json({ message: 'Authentication error: Submitting user is not assigned to a Faculty.' });
        }
        // -----------------------------------------------------------

        const newProject = await Projects.create({
            title,
            description,
            // --- FIX: Use correct foreign key names (camelCase) ---
            CategoryId: categoryId, // Sequelize expects CategoryId (FK to Categories table)
            SubmittedById: submittedById, // Sequelize expects SubmittedById (FK to User table)
            FacultyId: submittingUser.FacultyId, // FIX: Added required FacultyId
            
            githubLink: githubLink || null,
            demoLink: demoLink || null, 
            documentUrl: documentUrl,
            year: requiredYear,
            status: 'Pending', 
        });


        res.status(201).json(newProject); 
    } catch (error) {
        console.error('Error creating project:', error);
        // Provide more detailed error feedback for debugging
        res.status(500).json({ message: 'Failed to submit project. Ensure all foreign keys (Category, Faculty) are valid.', error: error.message });
    }
});


// @desc 	Update a project's status (Approval/Rejection)
// @route 	PUT /api/projects/:id/status
// @access 	Private (Supervisor/Admin only)
const updateProjectStatus = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const newStatus = req.body.status;
    const validStatuses = ['Approved', 'Rejected'];

    if (!newStatus || !validStatuses.includes(newStatus)) {
        return res.status(400).json({ message: 'Invalid status provided. Must be Approved or Rejected.' });
    }

    try {
        const project = await Projects.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        project.status = newStatus;
        await project.save();

        res.status(200).json({
            message: `Project status updated to ${newStatus}.`,
            project: project
        });

    } catch (error) {
        console.error(`Error updating status for project ${projectId}:`, error);
        res.status(500).json({ message: 'Failed to update project status.' });
    }
});


// @desc 	Get all available categories
// @route 	GET /api/categories
// @access 	Private
const getCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Categories.findAll({ attributes: ['id', 'name'] });
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Failed to fetch categories." });
    }
});

// @desc 	Get all available technologies
// @route 	GET /api/technologies
// @access 	Private
const getTechnologies = asyncHandler(async (req, res) => {
    // NOTE: This assumes a 'Technologies' model exists. If not, this route will fail.
    try {
        const technologies = await Technologies.findAll({ attributes: ['id', 'name'] });
        res.status(200).json(technologies);
    } catch (error) {
        // If Technologies model doesn't exist, this error will fire.
        console.error("Error fetching technologies (Did you create the model?):", error);
        res.status(500).json({ message: "Failed to fetch technologies." });
    }
});


// @desc 	Link technologies to a project
// @route 	POST /api/project_technologies
// @access 	Private (Student/Supervisor/Admin)
const linkTechnologies = asyncHandler(async (req, res) => {
    // This is a placeholder for linking, assuming a ProjectTechnology join table would be used.
    const techInserts = req.body; 

    if (!Array.isArray(techInserts) || techInserts.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty technology payload.' });
    }

    res.status(201).json({
        message: 'Technologies link received successfully. (Linking skipped: Model not yet implemented).',
        data: []
    });

});

module.exports = {
    getAllProjects,
    getProjectsByStatus,
    createProject,
    updateProjectStatus,
    getCategories,
    getTechnologies,
    linkTechnologies 
};