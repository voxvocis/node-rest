/*
 * Library for storing and editing data
 */

const fs = require("fs");
const path = require("path");

// Container for the module
const lib = {};

// Base directory for the data folder
lib.baseDir = path.join(__dirname, "../.data");

// Write data to a file
lib.create = (dir, filename, data, callback) => {
  const filePath = `${lib.baseDir}/${dir}/${filename}.json`;
  const flags = "wx"; // 'wx' - Open file for writing. The file is created (if it does not exist) or fails if path exists.

  // Open the file for writing
  fs.open(filePath, flags, (error, fileDescriptor) => {
    if (!error && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);
    } else {
      callback("Could not create new file, it may already exist");
    }
  });
};

module.exports = lib;
