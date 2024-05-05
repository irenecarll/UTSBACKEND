const { Customer } = require('../../../models');

/**
 * Get a list of customers
 * @returns {Promise}
 */
async function getCustomers() {
  return Customer.find({});
}

/**
 * Get customer detail
 * @param {string} id - Customer ID
 * @returns {Promise}
 */
async function getCustomer(id) {
  return Customer.findById(id);
}

/**
 * Create new customer
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @param {string} phone_number - Phone Number
 * @param {number} total_purchase - Total Purchase
 * @param {string} city - City
 * @param {string} payment_status - Payment Status
 * @returns {Promise}
 */
async function createCustomer(name, email, password, phone_number, total_purchase, city, payment_status) {
  return Customer.create({
    name,
    email,
    password,
    phone_number,
    total_purchase,
    city,
    payment_status,
  });
}

/**
 * Update existing customer
 * @param {string} id - Customer ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateCustomer(id, name, email) {
  return Customer.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a customer
 * @param {string} id - Customer ID
 * @returns {Promise}
 */
async function deleteCustomer(id) {
  return Customer.deleteOne({ _id: id });
}

/**
 * Get customer by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getCustomerByEmail(email) {
  return Customer.findOne({ email });
}

/**
 * Update customer password
 * @param {string} id - Customer ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return Customer.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerByEmail,
  changePassword,
};