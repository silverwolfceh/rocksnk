module.exports = function (app) {
  app.get("/decrypt", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send("No string provided");
  });

  app.get("/decrypt/:str", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const chars = [...req.params.str]
      .map((e, i) =>
        String.fromCharCode(parseInt(+req.params.str.charCodeAt(i) >> 2, 8))
      )
      .join("")
      .replace(/\u0000/g, " ");
    res.send(chars);
  });
};
