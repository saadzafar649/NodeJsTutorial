const DataTypes = require("sequelize");
const sequelize = require('../db/connection')

const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement:true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  archive:{
    type: DataTypes.BOOLEAN,
    default:false,
    allowNull: false,
  }
});



module.exports = User ;