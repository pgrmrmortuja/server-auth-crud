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

        //Get All User
        app.get("/users", async (req , res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        //Registration
        app.post("/register", async (req, res) =>{
            const data = req.body;
            console.log("data from client: ",data);
            const {name, email, password} = data;
            
            
            const existing = await userCollection.findOne({email});
            if(existing){
                return res.json({message: "Email already exists"});
            }

            const hashed = await bcrypt.hash(password, 10);


            const result = await userCollection.insertOne({
                name: name,
                email: email,
                password: hashed
            });

            console.log("result send to mongodb",result);

            res.json({result, name, email});
           
        })

        //Login
        app.post("/login", async (req, res) =>{
            const data = req.body;
            const{email, password} = data;
            
            const user = await userCollection.findOne({email});

            if(!user){
                return res.json({message: "User not found, Please Register First"});
            }

            const ok = await bcrypt.compare(password, user.password);

            if(!ok){
                return res.json({message: "Wrong Password. Please Try Again"});
            }

            const safeUser = {
                name: user.name,
                email: user.email
            }

            res.json({message: "Login Success", safeUser});
        })

        //Reset Password
        app.patch("/reset-password", async (req , res) =>{
            const {email, newPassword} = req.body;
            const user = await userCollection.findOne({email});

            if(!user){
                return res.json({message: "User not found"});
            }

            const filter = {email: user.email}

            const hashed = await bcrypt.hash(newPassword , 10);
            const update = {
                $set:{
                    password: hashed
                }
            }

            const result = await userCollection.updateOne(filter, update);

            res.json({message: "Password Reset Successfull", result});
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