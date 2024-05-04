const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users 
 * @param {number} page - Page number
 * @param {number} pageSize - Number of users per page
 * @param {string} search - Search keyword for filtering
 * @param {string} sort - Sorting criteria
 * @returns {Object}
 */
async function getUsers(page, pageSize, search = '', sort = '') {
  try {
    // membuat nilai untuk page dan pageSize jika nilainya tidak disediakan 
    if (!page) page = 1;
    if (!pageSize) pageSize = 10;
    
    //panggil semua data user dari repository
    let users = await usersRepository.getUsers();

    // Memastikan bahwa users dalam bentuk array
    if (!Array.isArray(users)) {
      // Jika users bukan array, konversi ke array
      users = Array.from(users);
    }
  
    //searching
    if(search) {
      users = users.filter(user => user.email.includes(search));
    }
  
    //sorting
    if(sort) {
      const [sortBy, sortOrder] = sort.split(':');
      users = users.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortBy].localeCompare(b[sortBy]);
        } else if (sortOrder === 'desc') {
          return b[sortBy].localeCompare(a[sortBy]);
        } else {
          return 0;
        }
      });
    }
  
    // hitung pagination
    const totalUsers = search ? await usersRepository.countUsers(search) : users.length;
    const totalPages = Math.ceil(totalUsers / pageSize);
    const startIndex = (page -1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalUsers - 1);
    const paginatedUsers = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const user = users[i];
      paginatedUsers.push({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }
  
    //output
  
    const result = {
      page_number: page,
      page_size: pageSize,
      count: paginatedUsers.length,
      total_pages: totalPages,
      has_previous_page: page > 1,
      has_next_page: endIndex < totalUsers - 1,
      data: paginatedUsers,
    };
  
    return result;

    } catch (error) {
      console.error('Error while fetching users', error);
      throw error;
  }
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