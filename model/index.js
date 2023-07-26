const sequelize = require('../db/connection')
require('./User')
require('./History')

sequelize
  .sync()
  .then(() => {
    console.log("Tables created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = sequelize