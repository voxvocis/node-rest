/**
 * Create and export configuration variables
 *
 */

// container for all the environment
const environments = {};

// Staging (default) environment
environments.staging = {
  port: 3000,
  envName: "Staging"
};

// Production environment
environments.production = {
  port: 5000,
  envName: "Production"
};

const currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

const environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
