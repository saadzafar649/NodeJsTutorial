const DataTypes = require("sequelize");
const sequelize = require('../db/connection');
const User = require("./User");

const LoginHistory = sequelize.define("login_histories", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement:true
  },
  type:{
    type: DataTypes.STRING,
    allowNull:false,
  }
});

LoginHistory.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });


module.exports = LoginHistory ;