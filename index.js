const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



//midleware
app.use(cors());
app.use(express.json());

//Database Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6rclh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//main funcationality
async function run(){

    try{

        await client.connect();
        const databae = client.db('travelbooking')
        const bookingCollection = databae.collection('booking');
        console.log('database is connected');

        //GET API
        app.get('/booking',async(req,res)=>{
            const cursor = bookingCollection.find({})
            const result = await cursor.toArray();
            res.json(result);
        });

        //GET API (BY SINGLE ID)
        app.get('/booking/:id',async(req,res)=>{
            const id = req.params.id;
            const query = { _id:ObjectId(id) }
            const booked = await bookingCollection.findOne(query);
            res.send(booked);
        })
        

    }
    finally{

    }

}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('This is Traveling-Vacation-website server');
});
app.listen(port,()=>{
    console.log('Server is Running',port);
});