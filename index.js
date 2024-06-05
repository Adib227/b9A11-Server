const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);
console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0xksggv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const volunteerCollection = client
      .db('volunteerManage')
      .collection('volunteerNeed');
    const volunteerAdd = client
      .db('volunteerManage')
      .collection('volunteerAdd');
    app.get('/needs', async (req, res) => {
      const result = await volunteerCollection.find().toArray();
      res.send(result);
    });

    app.get('/adds', async (req, res) => {
      const result = await volunteerAdd.find().toArray();
      res.send(result);
    });

    app.get('/needs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await volunteerCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.post('/adds', async (req, res) => {
      const newPost = req.body;
      console.log(newPost);
      const result = await volunteerAdd.insertOne(newPost);
      res.send(result);
    });

    app.get('/adds/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await volunteerAdd.findOne(query);
      console.log(result);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('volunteer is running');
});

app.listen(port, () => {
  console.log(`Volunteer Management Server is running on port ${port}`);
});
