const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
// const axios = require('axios');
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cbqlcas.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection =  client.db('taskManagement').collection('user')
    // const taskCollection = client.db('TaskManager').collection('task')
    const taskCollection = client.db("taskManagement").collection("task")


    app.post('/user', async(req, res) => {
      const userInfo = req.body
      const result = await userCollection.insertOne(userInfo)
      res.send(result)
    })
    app.get('/user', async(req, res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post("/task", async(req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task)
      res.send(result)
    })

    app.get('/task', async(req, res) => {
      const cursor = taskCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})