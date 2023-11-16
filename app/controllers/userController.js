const usersService = require('../services/users');

// 7 days refresh token
function setTokenCookie(res, token) {
  const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7*24*60*60*1000)
  };
  res.cookie('refreshToken', token, cookieOptions);
}

// Controller functions

function register(req, res, next) {
  usersService.register(req.body, req.get('origin'))
      .then(() => res.json({ message: 'Registration successful, please check your email for verification instructions' }))
      .catch(next);
}

function verifyEmail(req, res, next) {
  usersService.verifyEmail(req.body)
      .then(() => res.json({ message: 'Verification successful, you can now login' }))
      .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;
  const ipAddress = req.ip;

  usersService.login({ email, password, ipAddress })
      .then(({ refreshToken, ...account }) => {
          setTokenCookie(res, refreshToken);
          res.json(account);
      })
      .catch(next);
}

function resetPassword(req, res, next) {
  usersService.resetPassword(req.body, req.get('origin'))
      .then(() => res.json({ message: 'Password reset successful, you can now login' }))
      .catch(next);
}

function changePassword(req, res, next) {
  usersService.changePassword(req.auth.id, req.body)
      .then(() => res.json({ message: 'Password change successful, you can now login' }))
      .catch(next);
}

function forgotPassword(req, res, next) {
  usersService.forgotPassword(req.body, req.get('origin'))
      .then(() => res.json({ message: 'Please check your email for password reset instructions' }))
      .catch(next);
}

module.exports = userController = {
  register,
  verifyEmail,
  resetPassword,
  forgotPassword,
  changePassword,
  login
};
