const Sequelize = require('sequelize');
const moment = require('moment');
const logger = require('../config/logger');
const dbModels = require('../config/dbmodels')
const { products: Product } = dbModels;
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user_cart_items', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "hidden"
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "hidden",
      references: {
        model: 'user_cart',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "100 = 1.00 TRY",
      get() {
        const formattedPrice = `${(this.getDataValue('total_price') / 100).toLocaleString(undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}${' '}₺`;
        return formattedPrice;

      }
    },
    payment_id: {
      type: DataTypes.STRING(32),
      allowNull: true,
      comment: "hidden"
    },
    block: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      get() {
        return moment(this.getDataValue('date_created')).format('DD/MM/YYYY h:mm:ss');
      }
    },
    date_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'user_cart_items',
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
        name: "order_items_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
      {
        name: "order_items_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "cart_id" },
        ]
      },
    ]
  });
};
