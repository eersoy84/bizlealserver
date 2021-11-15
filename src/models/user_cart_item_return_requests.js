const Sequelize = require('sequelize');
const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user_cart_item_return_requests', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_cart_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "hidden",
      references: {
        model: 'user_cart_items',
        key: 'id'
      }
    },
    return_reason_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "hidden",
      references: {
        model: 'return_reasons',
        key: 'id'
      }
    },
    return_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notes: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      comment: "hidden"
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      get() {
        return moment(this.getDataValue('date')).format('DD/MM/YYYY h:mm:ss');
      }
    },
    status: {
      type: DataTypes.ENUM('created', 'approved', 'success_no_product_return', 'success', 'denied', 'waiting_for_shipment', 'shipping', 'seller_rejected', 'proccessing_refund'),
      allowNull: false,
      defaultValue: "created"
    }
  }, {
    sequelize,
    tableName: 'user_cart_item_return_requests',
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
        name: "user_cart_item_id",
        using: "BTREE",
        fields: [
          { name: "user_cart_item_id" },
        ]
      },
      {
        name: "return_reason_id",
        using: "BTREE",
        fields: [
          { name: "return_reason_id" },
        ]
      },
    ]
  });
};
