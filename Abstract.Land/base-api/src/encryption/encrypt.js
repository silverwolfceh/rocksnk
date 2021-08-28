module.exports = function (app) {
  app.get("/encrypt", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send("No string provided");
  });

  app.get("/encrypt/:str", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const chars = [...req.params.str]
      .map((e, i) =>
        String.fromCharCode(+req.params.str.charCodeAt(i).toString(8) << 2)
      )
      .join("");
    res.send(chars);
  });
};
