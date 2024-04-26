const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017";
// const uri = "mongodb+srv://<username>:<password>@cluster81657.uygasmd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster81657";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const artCollection = client.db("artDB").collection("art");

    app.get("/art", async (req, res) => {
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/art", async (req, res) => {
      const newArt = req.body;
      console.log(newArt);
      const result = await artCollection.insertOne(newArt);
      res.send(result);
    });

    app.get("/art/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artCollection.findOne(query);
      res.send(result);
    });

    app.put("/art/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const currentArt = await artCollection.findOne(query);

      const updatedArt = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const art = {
        $set: {
          image: updatedArt.image || currentArt.image,
          item_name: updatedArt.item_name || currentArt.item_name,
          subcategory_name:
            updatedArt.subcategory_name || currentArt.subcategory_name,
          short_description:
            updatedArt.short_description || currentArt.short_description,
          price: updatedArt.price || currentArt.price,
          rating: updatedArt.rating || currentArt.rating,
          processing_time:
            updatedArt.processing_time || currentArt.processing_time,
          stock_status: updatedArt.stock_status || currentArt.stock_status,
          user_email: updatedArt.user_email || currentArt.user_email,
          user_name: updatedArt.user_name || currentArt.user_name,
        },
      };

      const result = await artCollection.updateOne(filter, art, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("art and craft is running");
});

app.listen(port, () => {
  console.log(`art and craft is running on port ${port}`);
});
