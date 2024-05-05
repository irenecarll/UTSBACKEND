const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

let loginAttempts = {};
const LOGIN_TIME_RESET = 30 * 60 * 1000; // set wakt 30 menit untuk reset attempt jadi 0

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} - Response object or pass an error to the next route
 */

async function login(request, response, next) {
  const { email, password } = request.body;
  try {
    const recent = Date.now(); // waktu sekarang yg akan di tampilkan dalam output api
    const lastAttempt = loginAttempts[email];

    let attempt;

    if (lastAttempt && recent - lastAttempt.time < LOGIN_TIME_RESET){
      if (lastAttempt.count > 5) {
        throw errorResponder(
          errorTypes.FORBIDDEN,`[${new Date().toISOString()}] User ${email} gagal login. Batas percobaan terlampaui. Attempt= ${attempt}.`
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

      if (loginAttempts[email].count > 5){
        attempt = loginAttempts[email].count;
        throw errorResponder(
          errorTypes.FORBIDDEN,`[${new Date().toISOString()}] User ${email} login gagal. Attempt= ${attempts}. telah mencapai limit, coba lagi setelah 30 menit.`
        );
        
      } else {
        attempt = loginAttempts[email].count;
        throw errorResponder(
          errorTypes.INVALID_CREDENTIALS,`[${new Date().toISOString()}] User ${email} login gagal. Attempt= ${attempt}.`
        );
      }
      
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
