const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const Sequelize = require('sequelize');


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
        // validate(value) {
        //   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        //     throw new Error('Password must contain at least one letter and one number');
        //   }
        // },
        set(value) {
          this.setDataValue('password', bcrypt.hashSync(value, bcrypt.genSaltSync(10), null))
        }
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
        comment: "hidden"
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
    console.log("user without password?")
    const x = await User.findOne(
      {
        where: { id },
        attributes: { exclude: ['password', 'created_date', 'created_ip'] },
      })
    return x;
  }
  User.prototype.checkPassword = async function (userInputPassword) {
    return await bcrypt.compare(userInputPassword, this.password);
  };

  User.associate = async function (email) {
    const user = await this.findOne({ where: { email } });
    return !!user;
  }
  return User;
};
