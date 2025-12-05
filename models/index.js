const Sequelize = require('sequelize');

const { sequelize } = require('../config/database'); 

const User = require('./User');
const Projects = require('./Projects');
const Categories = require('./Categories');

// Define ASSOCIATIONS

// A User (SubmittedBy) has many Projects
User.hasMany(Projects, { foreignKey: 'submittedById' });
// A Project belongs to a User (SubmittedBy)
Projects.belongsTo(User, { foreignKey: 'submittedById', as: 'SubmittedBy' });

// A Category has many Projects
Categories.hasMany(Projects, { foreignKey: 'categoryId' });
// A Project belongs to one Category
Projects.belongsTo(Categories, { foreignKey: 'categoryId', as: 'Category' });



module.exports = {
    sequelize,
    Sequelize,
    User,
    Projects,
    Categories,
};