const { readFileSync } = require("fs");
const { join } = require("path");

module.exports = readFileSync(join(__dirname, 'schema.graphql'), 'utf8');
