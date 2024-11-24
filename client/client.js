// Path to the Protocol Buffers file that defines the gRPC service and message structure.
const PROTO_PATH = './customers.proto';

// Importing the gRPC library for creating clients and invoking gRPC services.
const grpc = require("@grpc/grpc-js");

// Importing the protocol buffer loader to load the `.proto` file.
const protoLoader = require("@grpc/proto-loader");

// Loading the protocol buffer file into a JavaScript object with specific options.
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true, // Preserve field case as defined in the .proto file (no camelCase conversion).
    longs: String,  // Represent long integers as strings for compatibility.
    enums: String,  // Represent enums as strings instead of their integer values.
    arrays: true    // Ensure repeated fields are always treated as arrays, even if empty.
});

// Extracting the CustomerService definition from the loaded package.
const CustomerService = grpc.loadPackageDefinition(packageDefinition).CustomerService;

// Creating a gRPC client instance for interacting with the CustomerService.
// - "127.0.0.1:30043" is the address of the gRPC server.
// - `grpc.credentials.createInsecure()` is used for an insecure (non-SSL) connection.
const client = new CustomerService(
    "127.0.0.1:30043",
    grpc.credentials.createInsecure()
);

// Exporting the gRPC client so it can be used in other parts of the application.
module.exports = client;
