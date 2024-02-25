const config = require("../../../knexfile");
const knex = require("knex");

const connection = knex(process.env.NODE_ENV === "production" ? config.production : config.development);

module.exports = connection;