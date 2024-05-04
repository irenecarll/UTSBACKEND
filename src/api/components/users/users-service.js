const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users 
 * @param {number} pageNumber - Page number 
 * @param {number} pageSize - Number of users 
 * @param {string} sortBy - Field name to sorting
 * @param {string} sortOrder - Sort order 
 * @param {string} searchField - Field name (email or name) to searching
 * @param {string} searchKeyword - Keyword for searching
 * @returns {object} Pagination
 */

async function getUsers(pageNumber = 1, pageSize = 10, sortBy = 'email', sortOrder = 'asc', searchField = '', searchKeyword = '') {
  // mengembalikan semua data dengan memanggil fungsi getUsers dari users-repository jika pagesize dan pagenumber value nya kosong
  if (!pageNumber || !pageSize){
    return usersRepository.getUsers()
  }

  // searching dan filtering dengan menggunakan substring berdasarkan field name atau email
  let users = await usersRepository.getUsers();
  if (searchField && searchKeyword) {
    users = users.filter(user => user[searchField].includes(searchKeyword));
  }

  // sorting untuk mengurutkan data pengguna secara asc ata desc
  // jika comparison = 1 maka asc, comparison = -1 maka desc 
  users.sort((a, b) => {
    const fieldA = a[sortBy];
    const fieldB = b[sortBy];
    let comparison = 0;
    if (fieldA > fieldB) {
      comparison = 1;
    } else if (fieldA < fieldB) {
      comparison = -1;
    }
    return sortOrder === 'desc' ? comparison * -1 : comparison;
  });

  // pagination
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / pageSize);
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalUsers);

  // membuat output response yang akan ditampilkan setelah melakukan pagination
  const paginatedUsers = users.slice(startIndex, endIndex);

  return {
    page_number: pageNumber,
    page_size: pageSize,
    count: totalUsers,
    total_pages: totalPages,
    has_previous_page: pageNumber > 1,
    has_next_page: endIndex < totalUsers,
    data: paginatedUsers
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
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
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};