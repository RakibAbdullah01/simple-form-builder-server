const express = require("express");
const app = express();

const admin = require("firebase-admin");

const cors = require("cors");
require("dotenv").config();

const { MongoClient, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connect to Sarver
const uri = `mongodb+srv://Form_DB:QVSSAgiWSuaLcANG@cluster0.xnyj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const formCollection = client.db("Form_DB").collection("forms");
    const dataCollection = client.db("Form_DB").collection("datas");

    /* =============================
            FORM 
    ===============================*/
    // post form
    app.post("/form", async (req, res) => {
      const form = req.body;
      const result = await formCollection.insertOne(form);
      res.json(result);
    });

    // Get all Form
    app.get("/form", async (req, res) => {
      const cursour = await formCollection.find({}).toArray();
      res.send(cursour);
    });

    // Get Single Form
    app.get("/form/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const form = await formCollection.findOne(query);
      res.send(form);
    });

    /* =============================
            FORM DATA
    ===============================*/
    // post form
    app.post("/formdata", async (req, res) => {
      const form = req.body;
      const result = await dataCollection.insertOne(form);
      res.json(result);
    });

    // Get all Form
    app.get("/formdata", async (req, res) => {
      const cursour = await dataCollection.find({}).toArray();
      res.send(cursour);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Form Builder Sarver Running!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
