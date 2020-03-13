const server = require("./data/api/server.js");

port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(
    `\n* ${Date(
      Date.now
    ).toString()}Server listening on https://localhost:${port} *\n`
  );
});
