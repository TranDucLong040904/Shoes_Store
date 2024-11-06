const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("shoe_store", "root", "002525", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  // define: {
  //       timestamps: false
  //   }
});

let connectDB = async () => {
  try {
    await sequelize.authenticate(); // xac thuc astablished
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connectDB;
