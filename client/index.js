// Import the client module (custom module)
const client = require("./client");

// Import built-in and external modules
const path = require("path"); // For handling file and directory paths
const express = require("express"); // Web framework for Node.js
const bodyParser = require("body-parser"); // Middleware for parsing request bodies

// Initialize the Express application
const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json()); // Parse JSON payloads
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded data with simple query string parsing

//exposing RESTAPI which internally calls gRPC server function using gRPC
app.get('/', (req, res) =>{
    client.getAll(null, (err, data) => {
        if (!err) {
            res.send(data.customers);
        }
    })
})

app.post('/create', (req, res) =>{
    let newCustomer = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
    };

    client.insert(newCustomer, (err, data) => {
        if (err) throw err;

        console.log("Customer created successfully", data);
        res.send({ message: "Customer created successfully" }) ;
    });
})

app.post('/update', (req, res) =>{
    const updateCustomer = {
        id: req.body.id,
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
    };

    client.update(updateCustomer, (err, data) => {
        if (err) throw err;

        console.log("Customer updated successfully", data);
        res.send({ message: "Customer updated successfully"});
    });
})

app.post('/remove', (req, res) =>{
    client.remove({ id: req.body.id }, (err, _) => {
        if (err) throw err;

        console.log("Customer removed successfully");
        res.send({ message: "Customer removed successfully" });
    });
})
// Define the server's port (default to 3000 if not set in the environment)
const PORT = process.env.PORT || 3000;

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
