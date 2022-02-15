require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");
const urlencodedParser = express.urlencoded({ extended: true });

const { initSession } = require("./models/connect");
const { socketMiddware } = require("./middleware/socket.middleware");

// controllers
const teacherRouter = require("./routes/teacher.router");
const feedbackRouter = require("./routes/feedback.router");
const studentRouter = require("./routes/student.router");
const serviceRouter = require("./routes/service.router");
const payRouter = require("./routes/pay.router");
const catalogRouter = require("./routes/catalog.router");
const listsRouter = require("./routes/lists.router");
const moderRouter = require("./routes/moder.router");

app.set("view engine", "ejs");

// middleware

app.use(initSession);
app.use(cors());
app.use(express.json());
app.use(urlencodedParser);

app.use("/apiLearning", serviceRouter);
app.use("/apiLearning", teacherRouter);
app.use("/apiLearning", feedbackRouter);
app.use("/apiLearning", studentRouter);
app.use("/apiLearning", payRouter);
app.use("/apiLearning", catalogRouter);
app.use("/apiLearning", listsRouter);
app.use("/apiLearning", moderRouter);

const io = require("socket.io")(http, {
  path: `/socket.io/`,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketMiddware(io, app);

http.listen(process.env.PORT, () =>
  console.log("Server started on port ", process.env.PORT)
);
