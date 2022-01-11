const validator = require('validator');
const bcrypt = require('bcrypt');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const moment = require('moment');
const Sequelize = require('sequelize');

const hashPassword = async (user) => {
  if (!user.changed('password')) return
  var hash = await bcrypt.hash(user.password, 8)
  return user.setDataValue('password', hash)
}
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('users',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: "hidden"
      },
      email: {
        type: DataTypes.STRING(521),
        allowNull: true,
        unique: "email",
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error('Invalid email');
          }
        },
      },
      phone: {
        type: DataTypes.STRING(32),
        allowNull: true,
        unique: "phone"
      },
      password: {
        type: DataTypes.STRING(512),
        allowNull: true,
        comment: "hidden",
        private: true,
        minlength: 6,
      },
      role: {
        type: DataTypes.ENUM('superadmin', 'admin', 'standart'),
        allowNull: false,
        defaultValue: "standart"
      },
      firstName: {
        type: DataTypes.STRING(128),
        allowNull: false,
        field: 'first_name'

      },
      lastName: {
        type: DataTypes.STRING(128),
        allowNull: false,
        field: 'last_name'
      },
      email_confirmed: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      image: {
        type: DataTypes.STRING(512),
        allowNull: true
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: "hidden",
        get() {
          var date = this.getDataValue('created_date')
          if (date) return moment(date).format('YYYY-MM-DD hh:mm:ss')
          else return null
        },
      },
      created_ip: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: "hidden"
      },
      stellar_id: {
        type: DataTypes.STRING(512),
        allowNull: true,
        unique: "stellar_id"
      },
      stellar_wallet: {
        type: DataTypes.STRING(512),
        allowNull: true
      }
    },
    {
      hooks: {
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword
      },
      sequelize,
      tableName: 'users',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "id" },
          ]
        },
        {
          name: "email",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "email" },
          ]
        },
        {
          name: "phone",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "phone" },
          ]
        },
        {
          name: "stellar_id",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "stellar_id" },
          ]
        },
      ]

    },

  );


  User.prototype.withoutPassword = async function (id) {
    const x = await User.findOne(
      {
        where: { id },
        attributes: { exclude: ['password', 'created_date', 'created_ip'] },
      })
    return x;
  }

  User.prototype.checkPassword = async (userInputPassword, hashedPassword) => {
    return await bcrypt.compare(userInputPassword, hashedPassword);
  }

  User.associate = async function (email) {
    const user = await this.findOne({ where: { email } });
    return !!user;
  }
  return User;
};
