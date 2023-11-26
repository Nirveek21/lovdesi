const Sequelize = require("sequelize");
const sequelize = require("../../../database/connection");
module.exports = sequelize.define(
  "UserSecretInfo",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    temp_password: {
      allowNull: false,
      type: Sequelize.STRING
    },

    password: {
      allowNull: true,
      type: Sequelize.STRING
    },
    status: {
      allowNull: false,
      type: Sequelize.STRING
    },
  },
  {
    tableName: "user_secret_info",
  }
);