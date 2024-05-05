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
    celebrate({ body: customersValidator.createCustomer.body}),
    customersControllers.createCustomer
  );

  // Get customer detail
  route.get('/:id', authenticationMiddleware, customersControllers.getCustomer);

  // Update customer
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate({ body: customersValidator.updateCustomer.body}),
    customersControllers.updateCustomer
  );

  // Delete customer
  route.delete('/:id', authenticationMiddleware, customersControllers.deleteCustomer);

  // Change password
  route.post(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate({body: customersValidator.changeCustomerPassword.body}),
    customersControllers.changeCustomerPassword
    
  );
};