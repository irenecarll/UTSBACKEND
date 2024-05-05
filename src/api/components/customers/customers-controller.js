const customerService = require('./customers-service');
const customersValidator = require('./customers-validator');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of customers request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getCustomers(request, response, next) {
  try {
    const customers = await customerService.getCustomers();
    return response.status(200).json(customers);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get customer detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getCustomer(request, response, next) {
  try {
    const customer = await customerService.getCustomer(request.params.id);

    if (!customer) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown customer');
    }

    return response.status(200).json(customer);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create customer request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createCustomer(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;
    const phone_number = request.body.phone_number;
    const total_purchase = request.body.total_purchase;
    const city = request.body.city;
    const payment_status = request.body.payment_status;



    // Check confirmation password
    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Email must be unique
    const emailIsRegistered = await customerService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await customerService.createCustomer(name, email, password, phone_number, total_purchase, city, payment_status);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create customer'
      );
    }

    return response.status(200).json({ name, email, phone_number, total_purchase, city, payment_status });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update customer request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateCustomer(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;
    const phone_number = request.body.phone_number;
    const total_purchase = request.body.total_purchase;
    const city = request.body.city;
    const payment_status = request.body.payment_status;

    const success = await customerService.updateCustomer(id, name, email, phone_number, city, total_purchase, payment_status);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update customer'
      );
    }

    return response.status(200).json({ message: 'Update berhasil' });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete customer request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteCustomer(request, response, next) {
  try {
    const id = request.params.id;

    const success = await customerService.deleteCustomer(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete customer'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change customer password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changeCustomerPassword(request, response, next) {
  try {
    // Check password confirmation
    if (request.body.password_new !== request.body.password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Check old password
    if (
      !(await customerService.checkPassword(
        request.params.id,
        request.body.password_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await customerService.changePassword(
      request.params.id,
      request.body.password_new
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  changeCustomerPassword,
};