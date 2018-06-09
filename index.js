/**
 * Primary file for the API
 */

// Dependencies
const http = require("http");

// The server should respond to all request with a string
const server = http.createServer((req, res) => {
  res.end("Hello World!\n");
});

// Start the server, and listen on port 3000
server.listen(3000, () => {
  console.log("The server is listening on port 3000");
});
