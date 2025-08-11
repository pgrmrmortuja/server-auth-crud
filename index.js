const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) =>{
    res.send("The Auth Server Running...");
})

app.listen(port, () =>{
    console.log(`The server is running ${port} port`);
})