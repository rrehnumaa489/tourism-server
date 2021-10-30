const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = 5000;


//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o8ib5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//console.log(uri)


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        //console.log('connet to database')
        const database = client.db("sunnyPung");
        // const database = client.db("sunnyPung");
        const servicesCollection = database.collection("services");

        //Get API

        app.get('/services', async (req, res) => {
          const cursor =servicesCollection.find({});
          const services = await cursor.toArray();
          res.send(services);
        })


        //Get single service

        app.get('/services/:id', async (req, res) => {
          const id = req.params.id;
          
          const query = {_id : ObjectId(id)};
          const service = await servicesCollection.findOne(query);
          res.send(service);
        });

        //POST API

        app.post('/services', async (req, res) => {
          const service = req.body;
            console.log("hit the server", service)
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.send(result)
        })

        //Update Api

        app.put('/services/:id', async (req, res) => {
          const id = req.params.id;
          const updatedService = req.body;
          const filter = {_id: ObjectId(id)};
          const options = { upsert : true};
          const updateDoc = {
              $set : {
                name : updatedService.name,
                description : updatedService.description,
                price : updatedService.price,
                img : updatedService.img
              },
          };
          const result = await servicesCollection.updateOne(filter, updateDoc, options)
          console.log("updating user", req);
          res.json(result);
        })

        //Delete API
        app.delete('/services/:id', async (req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await servicesCollection.deleteOne(query);
          res.json(result);
        })
    }
    finally {
        //await client.close();
        
      }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Rehnuma!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});