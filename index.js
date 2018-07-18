/**
 * Primary file for the API
 */

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const StringDecoder = require("string_decoder").StringDecoder;

const config = require("./config");

// Instantiating the HTTP server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Start the http server
httpServer.listen(config.httpPort, () => {
  console.log(
    "The server is listening on port:",
    config.httpPort,
    "\nEnvironment mode:",
    config.envName
  );
});

// Instantiating the HTTPS server
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, () => {
  console.log(
    "The server is listening on port:",
    config.httpsPort,
    "\nEnvironment mode:",
    config.envName
  );
});

// Start the http server

// All the server logic for both the http and https server
const unifiedServer = (req, res) => {
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
      typeof router[trimmedPath] !== "undefined" ? router[trimmedPath] : router["notFound"];

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
      console.log("Returnning this response:", statusCode, " & ", payloadString);
    });
  });
};

// Request handlers
const handlers = {};

// Sample handler
handlers.sample = (data, callback) => {
  // Callback a HTTP status and a payload object
  callback(200, { name: "sample handler" });
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
