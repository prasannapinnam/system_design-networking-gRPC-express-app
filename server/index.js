// Path to the Protocol Buffers file that defines the gRPC service and message structure.
const PROTO_PATH = './customers.proto';

// Importing the gRPC library and protocol buffer loader.
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Loading the protocol buffer file into a JavaScript object with specific options.
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true, // Keep field names as-is (don't convert to camelCase).
    longs: String,  // Represent long integers as strings.
    enums: String,  // Represent enums as strings.
    arrays: true    // Always treat repeated fields as arrays.
});

// Load the gRPC package definition, enabling interaction with the defined service.
const customersProto = grpc.loadPackageDefinition(packageDefinition);

// Create a new gRPC server instance.
const server = new grpc.Server();

// Mock data representing customer records.
const customers = [{
    id: 'sdfshdfsd',
    name: 'Chirag Goel',
    age: 22,
    address: 'Bangalore'
}, {
    id: 'cvvbcbewb',
    name: 'Akshay Saini',
    age: 22,
    address: 'Uttrakhand'
}];

// Adding the defined CustomerService to the server, implementing its methods.
server.addService(customersProto.CustomerService.service, {
    // Method to fetch all customer records.
    getAll: (call, callback) => {
        callback(null, { customers }); // Return the full list of customers.
    },
    // Method to fetch a single customer by ID.
    get: (call, callback) => {
        let customer = customers.find(n => n.id == call.request.id); // Search for the customer.
        if (customer) {
            callback(null, customer); // Return the found customer.
        } else {
            callback({
                code: grpc.status.NOT_FOUND, // Error code for not found.
                details: "Not found"         // Error message.
            });
        }
    },
    // Method to insert a new customer record.
    insert: (call, callback) => {
        let customer = call.request; // Extract customer data from the request.
        customer.id = Math.random(); // Assign a random ID (should use a proper UUID generator like uuidv4).
        customers.push(customer);    // Add the new customer to the list.
        callback(null, customer);    // Return the newly created customer.
    },
    // Method to update an existing customer's information.
    update: (call, callback) => {
        let existingCustomer = customers.find(n => n.id == call.request.id); // Search for the customer.
        if (existingCustomer) {
            // Update customer fields with new data.
            existingCustomer.name = call.request.name;
            existingCustomer.age = call.request.age;
            existingCustomer.address = call.request.address;
            callback(null, existingCustomer); // Return the updated customer.
        } else {
            callback({
                code: grpc.status.NOT_FOUND, // Error code for not found.
                details: "Not found"         // Error message.
            });
        }
    },
    // Method to remove a customer by ID.
    remove: (call, callback) => {
        let existingCustomerIndex = customers.findIndex(
            n => n.id == call.request.id // Find the index of the customer.
        );

        if (existingCustomerIndex != -1) {
            customers.splice(existingCustomerIndex, 1); // Remove the customer from the list.
            callback(null, {}); // Respond with an empty object (no content).
        } else {
            callback({
                code: grpc.status.NOT_FOUND, // Error code for not found.
                details: "Not found"         // Error message.
            });
        }
    }
});

// Start the gRPC server, listening on the specified address and port.
server.bindAsync("127.0.0.1:30043", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(`Error starting gRPC server: ${err}`); // Log any startup errors.
    } else {
        server.start(); // Start the server.
        console.log(`gRPC server is listening on ${port}`); // Log the server's listening port.
    }
});
