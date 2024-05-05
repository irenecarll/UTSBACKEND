const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const customersControllers = require('./customers-controller');
const customersValidator = require('./customers-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/customers', route);

  // Get list of customers
  route.get('/', authenticationMiddleware, customersControllers.getCustomers);

  // Create customer
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(customersValidator.createCustomer),
    customersControllers.createCustomer
  );

  // Get customer detail
  route.get('/:id', authenticationMiddleware, customersControllers.getCustomer);

  // Update customer
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(customersValidator.updateCustomer),
    customersControllers.updateCustomer
  );

  // Delete customer
  route.delete('/:id', authenticationMiddleware, customersControllers.deleteCustomer);

  // Change password
  route.post(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate(customersValidator.changePassword),
    customersControllers.changePassword
  );
};