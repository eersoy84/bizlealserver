const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 6) {
    return helpers.message('girdiğiniz şifre en az 6 karakter uzunluğunda olmalıdır');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('şifreniz en az 1 karakter 1 numara bulundurmalıdır.');
  }
  return value;
};

module.exports = {
  objectId,
  password,
};
