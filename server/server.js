const express = require("express");
const cors = require("cors");
const connectDB = require("./connection");

const app = express();
const PORT = 3109;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/users", require("./controllers/users"));
app.use("/categories", require("./controllers/categories"));
app.use("/records", require("./controllers/records"));
app.use("/budgets", require("./controllers/budgets"));
app.use("/ratings", require("./controllers/ratings"));

connectDB();

app.listen(PORT, () => console.log(`App is flying on PORT: ${PORT}`));
