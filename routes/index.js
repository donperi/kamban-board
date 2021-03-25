const fs = require("fs");
const path = require("path");

const basename = path.basename(__filename);
const routes = {};

fs.readdirSync(path.dirname(__filename))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .map((file) => {
    routes[file.slice(0, -3)] = require(path.join(__dirname, file));
  });

module.exports = routes;
