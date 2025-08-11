const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());

const {MongoClient, ObjectId, ServerApiVersion} = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dk8ve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri);

const run = async () =>{
    try{
        await client.connect();
        console.log("MongoDB connected Successfully");

        const database = client.db("testDB");
        const userCollection = database.collection("users");

        app.post("/register", async (req, res) =>{
            const data = req.body;
            const result = await userCollection.insertOne(data);
            res.send(result);
        })








    } catch (error){
        console.log("Mongodb Connection Failed: ",error);
    }
}
run();



app.get("/", (req, res) =>{
    res.send("The Auth Server Running...");
})

app.listen(port, () =>{
    console.log(`The server is running ${port} port`);
})