const { User } = require('../../../models');

/**
 * Get a list of users
 * @param {number} page - Page number
 * @param {number} pageSize - Number of users per page
 * @param {string} search - Search keyword for filtering
 * @param {string} sort - Sorting criteria
 * @returns {Promise}
 */

async function getUsers(page, pageSize, search= '', sort = '') {
  try {
    // untuk mencari users
    let query = User.find();

    // filtering
    if(search){
      query = query.where('email').regex(new RegExp(search, 'i'));
    }

    //sorting
    if(sort) {
      const [sortBy, sortOrder] = sort.split(':');
      query = query.sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1});
    }

    //hitung total users
    const totalUsers = await User.countDocuments(query);

    //pagination
    query = query.skip((page - 1) * pageSize).limit(pageSize);

    //ambil pengguna berdasarkan query yang sudah dibuat
    const users = await query.exec();

    //hitung jumlah halaman
    const totalPages = Math.ceil(totalUsers/pageSize);

    //return result
    const result = {
      page_number:page,
      page_size: pageSize,
      count: users.length,
      total_pages: totalPages,
      has_previous_page: page > 1,
      has_next_page: (page*pageSize) < totalUsers,
      data: users,
    };

    return result;
  } catch (error){
    throw error;
  }
  
}

/**
 * Count total users based on search criteria
 * @param {string} search - Search keyword for filtering
 * @returns {Promise<number>} - Total count of users
 */
async function countUsers(search) {
  try {
    let query = User.find();

    // filtering based on search keyword
    if (search) {
      query = query.where('email').regex(new RegExp(search, 'i'));
    }

    // count total users
    const totalUsers = await User.countDocuments(query);
    return totalUsers;
  } catch (error) {
    throw error;
  }
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
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
  countUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};