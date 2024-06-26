const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise} 
 */

async function getUsers() {
  try {
    return await User.find({}, { password: 0}); // password : 0 artinya properti password tidak akan ditampilkan atau nilainya false
    
  } catch (error) {
    // Handle error
    throw new Error('get users from the database is failed');
  }
}

/**
 * Get user detail by ID
 * @param {string} id - User ID
 * @returns {Promise} User object
 */
async function getUser(id) {
  try {
    return await User.findById(id);
  } catch (error) {
    // Handle error
    throw new Error(`Get user with ID ${id} from the database is failed`);
  }
}


/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
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
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};