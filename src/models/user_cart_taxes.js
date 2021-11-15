const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_cart_taxes', {
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
    tax_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'taxes',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user_cart_taxes',
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
        name: "user_cart_taxes_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "cart_id" },
        ]
      },
      {
        name: "user_cart_taxes_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "tax_id" },
        ]
      },
    ]
  });
};
