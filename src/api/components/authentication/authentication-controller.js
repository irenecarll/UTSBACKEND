const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

let loginAttempts = {};
const LOGIN_ATTEMPT_TIME_RESET = 30 * 60 * 1000;
/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    const recent = Date.now();
    const lastAttempt = loginAttempts[email];

    if (lastAttempt && recent - lastAttempt.time < LOGIN_ATTEMPT_TIME_RESET){
      if (lastAttempt.count >= 5) {
        throw errorResponder(
          errorTypes.FORBIDDEN,'Too many login attempt. Please try again later'
        );
      }
    } else {
      loginAttempts[email] = { count : 0, time: recent};
    }

    loginAttempts[email].count++;

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password,
      loginAttempts[email].count
    );

    if(!loginSuccess){
      if (loginAttempts[email].count >=5){
        throw errorResponder(
          errorTypes.FORBIDDEN,'Too many login attempt, please try again later'
        );
      }
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }
    
    delete loginAttempts[email];

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
