const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_chart_seller_ratings', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_cart',
        key: 'id'
      }
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'seller',
        key: 'id'
      }
    },
    rating_value_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rating_values',
        key: 'id'
      }
    },
    value: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'user_chart_seller_ratings',
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
        name: "cart_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cart_id" },
          { name: "seller_id" },
          { name: "rating_value_id" },
        ]
      },
      {
        name: "user_chart_seller_ratings_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "rating_value_id" },
        ]
      },
      {
        name: "user_chart_seller_ratings_ibfk_3",
        using: "BTREE",
        fields: [
          { name: "seller_id" },
        ]
      },
    ]
  });
};
