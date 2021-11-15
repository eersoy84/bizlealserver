const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payments', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: "uuid"
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_orders',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('downpayment','refund','payment'),
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    method: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    reference: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('proccessing','failed','successful','created'),
      allowNull: false,
      defaultValue: "created"
    }
  }, {
    sequelize,
    tableName: 'payments',
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
        name: "order_id",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
    ]
  });
};
