const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_taxes', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
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
    }
  }, {
    sequelize,
    tableName: 'product_taxes',
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
        name: "tax_id",
        using: "BTREE",
        fields: [
          { name: "tax_id" },
        ]
      },
      {
        name: "product_taxes_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
    ]
  });
};
