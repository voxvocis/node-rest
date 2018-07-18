/**
 * Create and export configuration variables
 *
 */

// container for all the environment
const environments = {};

// Staging (default) environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "Staging",
  httpsCert: "./https/cert.pem",
  httpsKey: "./https/key.pem"
};

// Production environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "Production",
  httpsCert: "./https/cert.pem",
  httpsKey: "./https/key.pem"
};

const currentEnvironment =
  typeof process.env.NODE_ENV == "string" ? process.env.NODE_ENV.toLowerCase() : "";

const environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
