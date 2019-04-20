const express = require("express");
ObjectId = require("mongodb").ObjectID;

const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://<username>:<password>@cluster5-a7bc0.mongodb.net/myDb?retryWrites=true";

// Connect to MongoDB
/* MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  const dbo = db.db("db");
  dbo.collection("contacts").findOne({}, function(err, result) {
    if (err) throw err;
    // console.log(result);
    db.close();
  });
}); */

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send(`<h1>Please use the API URI: api/contacts</h1>`);
});

// Get Contacts
app.get("/api/contacts", (req, res) => {
  // res.send(`<h1>Please use the API URI: api/contacts</h1>`);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("db");
    dbo
      .collection("contacts")
      .find({})
      .toArray(function(err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(JSON.stringify(result));
        db.close();
      });
  });
});

// Get Contact
app.get("/api/contacts/:id", (req, res) => {
  // res.send(`<h1>Please use the API URI: api/contacts</h1>`);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("db");
    // const contact = { _id: req.params.id };
    const contact = { _id: new ObjectId(req.params.id) };
    // console.log(`${req.params.id} ${req.params.limit}`);
    dbo
      .collection("contacts")
      .find(contact)
      .toArray(function(err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(JSON.stringify(result));
        db.close();
      });
  });
});

// Create New Contact
app.post("/api/contacts", (req, res) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("db");
    const newContact = req.body;
    if (!newContact.name || !newContact.phone || !newContact.email) {
      res.status(400).send("Please include Name, Phone and Email");
    } else {
      dbo.collection("contacts").insertOne(newContact, (err, result) => {
        if (err) throw err;
        res.status(200).send(`Added new contact ${newContact}`);
        db.close();
      });
    }
  });
});

// Update Contact
app.put("/api/contacts/:id", (req, res) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("db");
    // const contact = { _id: req.params.id };
    const contact = { _id: new ObjectId(req.params.id) };
    var newvalues = {
      $set: {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
      }
    };
    dbo
      .collection("contacts")
      .updateOne(contact, newvalues, function(err, result) {
        if (err) throw err;
        // console.log("1 document updated");
        res.send(`Contact updated ${contact}`);
        db.close();
      });
  });
});

// Delete Contact
app.delete("/api/contacts/:id", (req, res) => {
  // res.send(`<h1>Please use the API URI: api/contacts</h1>`);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("db");
    // const contact = { _id: req.params.id };
    const contact = { _id: new ObjectId(req.params.id) };
    // console.log(req.params.id);
    dbo.collection("contacts").deleteOne(contact, function(err, result) {
      if (err) throw err;
      // console.log(result);
      res.send(`Contact with ID ${req.params.id} is deleted`);
      db.close();
    });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
