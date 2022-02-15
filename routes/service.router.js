const fs = require("fs");
const Router = require("express");
const router = new Router();

router.get("/public/uploads/teachers/:path", (req, res) => {
  try {
    const filePath = req.url.substr(1);
    if (!filePath)
      return res.status(400).json({ message: "Unvalid image url" });

    fs.readFile(`./${filePath}`, function (error, data) {
      if (error) {
        res.statusCode = 404;
        res.end("Resourse not found!");
      } else {
        res.end(data);
      }
    });
  } catch (e) {
    return res.status(400).json({ message: "Error" });
  }
});

module.exports = router;
