const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mnfgc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("doctors"));


const port = 5000;

app.get("/", (req, res) => {
  res.send("hello world");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client
    .db("interiorDesign")
    .collection("services");
    const doctorCollection = client.db("doctorPortals").collection("doctors");

  console.log("database connected");

  app.post("/addService", (req, res) => {
    console.log(req.body);
    const service = req.body;
      serviceCollection.insertOne(service).then((result) => {
        console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/services", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
    app.get('/singleService', (req, res) => {
        console.log(req.params.id);
        // serviceCollection.find({}).toArray((err, documents) => {
        //   res.send(documents);
        // });
    })

  app.post("/appointmentsByDate", (req, res) => {
    const date = req.body;
    const email = req.body.email;
    doctorCollection.find({ email: email }).toArray((err, doctors) => {
      const filter = { date: date.date };
      if (doctors.length === 0) {
        filter.email = email;
      }
      appointmentCollection.find(filter).toArray((err, documents) => {
        console.log(email, date.date, doctors, documents);
        res.send(documents);
      });
    });
  });

  app.post("/addADoctor", (req, res) => {

      doctorCollection.insertOne(req.body)
          .then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/doctors", (req, res) => {
    doctorCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/isDoctor", (req, res) => {
    const email = req.body.email;
    doctorCollection.find({ email: email }).toArray((err, doctors) => {
      res.send(doctors.length > 0);
    });
  });
});



app.listen(process.env.PORT || port);