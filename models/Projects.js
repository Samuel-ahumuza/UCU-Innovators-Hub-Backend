const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database'); 

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    faculty: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'ICT'
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    githubLink: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending',
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true, 
    },
    submittedById: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'projects',
});

module.exports = Project;