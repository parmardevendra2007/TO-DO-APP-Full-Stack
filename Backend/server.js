const app=require("./app");
require("dotenv").config();
const connectDB = require("./src/DB/db");
const cookieParser = require("cookie-parser");

connectDB();
console.log("MONGO_URI:", process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});