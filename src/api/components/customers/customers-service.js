const customersRepository = require('./customers-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of customers
 * @returns {Array}
 */
async function getCustomers() {
  const customers = await customersRepository.getCustomers();

  const results = [];
  for (let i = 0; i < customers.length; i += 1) {
    const customer = customers[i];
    results.push({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone_number: customer.phone_number,
      city: customer.city,
      total_purchase: customer.total_purchase,
      payment_status: customer.payment_status,
    });
  }

  return results;
}

/**
 * Get customer detail
 * @param {string} id - Customer ID
 * @returns {Object}
 */
async function getCustomer(id) {
  const customer = await customersRepository.getCustomer(id);

  // Customer not found
  if (!customer) {
    return null;
  }

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone_number: customer.phone_number,
    city: customer.city,
    total_purchase: customer.total_purchase,
    payment_status: customer.payment_status,
  };
}

/**
 * Create new customer
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @param {string} phone_number - Phone Number
 * @param {number} total_purchase - Total Purchase
 * @param {string} city - City
 * @param {string} payment_status - Payment Status
 * @returns {boolean}
 */

async function createCustomer(name, email, password, phone_number, total_purchase, city, payment_status) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await customersRepository.createCustomer(name, email, hashedPassword, phone_number, total_purchase, city, payment_status);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing customer
 * @param {string} id - Customer ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateCustomer(id, name, email) {
  const customer = await customersRepository.getCustomer(id);

  // Customer not found
  if (!customer) {
    return null;
  }

  try {
    await customersRepository.updateCustomer(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete customer
 * @param {string} id - Customer ID
 * @returns {boolean}
 */
async function deleteCustomer(id) {
  const customer = await customersRepository.getCustomer(id);

  // Customer not found
  if (!customer) {
    return null;
  }

  try {
    await customersRepository.deleteCustomer(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const customer = await customersRepository.getCustomerByEmail(email);

  if (customer) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} customerId - Customer ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(customerId, password) {
  const customer = await customersRepository.getCustomer(customerId);
  return passwordMatched(password, customer.password);
}

/**
 * Change customer password
 * @param {string} customerId - Customer ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(customerId, password) {
  const customer = await customersRepository.getCustomer(customerId);

  // Check if customer not found
  if (!customer) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await customersRepository.changePassword(
    customerId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  emailIsRegistered,
  checkPassword,
  changePassword,
};