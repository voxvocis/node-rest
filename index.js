/**
 * Primary file for the API
 */

// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");

// The server should respond to all request with a string
const server = http.createServer((req, res) => {
  // Get the URL and parse it
  const parsedUrlObject = url.parse(req.url, true);

  // Get the path
  const untrimmedPath = parsedUrlObject.pathname;
  const trimmedPath = untrimmedPath.replace(/^\/+|\/+$/g, "");

  // Get the query string as an Object
  const queryStringObject = parsedUrlObject.query;

  // Get the HTTP Method
  const method = req.method.toLowerCase();

  // Get the HTTP headers

  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", data => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    // Choose a handler
    const handler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : router["notFound"];

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    };

    // Route the request to the chosen handler
    handler(data, (statusCode = 200, payload = {}) => {
      // convert the payload string
      const payloadString = JSON.stringify(payload);

      // return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the requst path
      console.log(
        "Returnning this response:",
        statusCode,
        " & ",
        payloadString
      );
    });
  });
});

// Start the server, and listen on port 3000
server.listen(config.port, () => {
  console.log(
    "The server is listening on port:",
    config.port,
    "\nEnvironment mode:",
    config.envName
  );
});

// Request handlers
const handlers = {};

// Sample handler
handlers.sample = (data, callback) => {
  // Callback a HTTP status and a payload object
  callback(406, { name: "sample handler" });
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// Request router
const router = {
  sample: handlers.sample,
  notFound: handlers.notFound
};
