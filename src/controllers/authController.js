const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const register = catchAsync(async (req, res) => {
  await userService.createUser({ ...req.body, created_ip: req.socket.remoteAddress });
  res.status(httpStatus.CREATED).send();
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = await tokenService.generateAuthTokens(user);
  res.send({ user, token });
});
const googleLogin = catchAsync(async (req, res) => {
  const { code } = req.body;
  const user = await authService.googleLogin(code, req.socket.remoteAddress)
  const token = await tokenService.generateAuthTokens(user)
  res.send({ user, token });
});

const facebookLogin = catchAsync(async (req, res) => {
  const user = await authService.facebookLogin(req.body, req.socket.remoteAddress)
  const token = await tokenService.generateAuthTokens(user)
  res.send({ user, token });

});
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.OK).send();
});

const updatePassword = catchAsync(async (req, res) => {
  await authService.updatePassword(req.user.id, req.body.password);
  res.status(httpStatus.OK).send("Şifreniz başarıyla güncellendi");
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService2.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  updatePassword,
  sendVerificationEmail,
  verifyEmail,
  googleLogin,
  facebookLogin
};
