module.exports = function (app) {
  require("./encrypt")(app);
  require("./decrypt")(app);
};
