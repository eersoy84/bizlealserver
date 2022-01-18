const Sequelize = require('sequelize');
const moment = require('moment');
const UserCart = function (sequelize, DataTypes) {
  return sequelize.define('user_cart', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "hidden"
    },
    uuid: {
      type: DataTypes.STRING(42),
      allowNull: true,
      unique: "uuid"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "hidden",
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('created', 'blocking', 'paid', 'preparing', 'delivering', 'delivered', 'canceled', 'refunded'),
      allowNull: false,
      defaultValue: "created"
    },
    sub_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      get() {
        const formattedPrice = `${(this.getDataValue('sub_total') / 100).toLocaleString(undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}${' '}₺`;
        return formattedPrice;

      },
    },
    subTotal: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      get() {
        return this.getDataValue('sub_total') / 100
      },
    },
    total_tax: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    dateCreated: {
      type: DataTypes.VIRTUAL,
      get() {
        return moment(this.getDataValue('date_created')).locale('tr').format('Do MMMM YYYY, HH:MM');
      },
    },
    datePassed: {
      type: DataTypes.VIRTUAL,
      get() {
        return moment(this.getDataValue('date_created')).locale('tr').fromNow();
      },
    },
    date_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    dateUpdated: {
      type: DataTypes.VIRTUAL,
      get() {
        return moment(this.getDataValue('date_updated')).locale('tr').fromNow();
      },
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user_address',
        key: 'id'
      }
    },
    payment_id: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user_address',
        key: 'id'
      }
    }
  },
    {
      sequelize,
      tableName: 'user_cart',
      hasTrigger: true,
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
          name: "uuid",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "uuid" },
          ]
        },
        {
          name: "user_id",
          using: "BTREE",
          fields: [
            { name: "user_id" },
          ]
        },
        {
          name: "invoice_id",
          using: "BTREE",
          fields: [
            { name: "invoice_id" },
          ]
        },
        {
          name: "address_id",
          using: "BTREE",
          fields: [
            { name: "address_id" },
          ]
        },
      ]
    });
};
module.exports = UserCart