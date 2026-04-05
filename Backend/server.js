const app=require("./app");
require("dotenv").config();
const connectDB = require("./src/DB/db");
const cookieParser = require("cookie-parser");

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});