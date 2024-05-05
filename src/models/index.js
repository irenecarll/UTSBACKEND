const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const customersSchema = require('./customers-schema');

const usersSchema = require('./users-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', mongoose.Schema(usersSchema));

const Customer = mongoose.model('customers', mongoose.Schema(customersSchema));

const Product = mongoose.model('products', mongoose.Schema(customersSchema));

const Purchase = mongoose.model('custpurchase', mongoose.Schema(customersSchema));







module.exports = {
  mongoose,
  Customer,
  Product,
  Purchase,
  User,
};
