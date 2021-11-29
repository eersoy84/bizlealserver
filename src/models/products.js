const Sequelize = require('sequelize');
const logger = require('../config/logger');
const product_reviews = require('./product_reviews');
const product = function (sequelize, DataTypes) {
  return sequelize.define('products', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    seller: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'seller',
        key: 'id'
      }
    },
    model_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'model',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    min_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Indirimin baslaması icin minimum satin alma"
    },
    max_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "indirimin yapilacagi maksimum satis"
    },
    total_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Toplam Stok Adedi"
    },
    max_discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Yapilacak en fazla indirim"
    },
    discount_step: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    normal_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Baslangic Fiyati",
      get() {
        const formattedPrice = `${(this.getDataValue('normal_price') / 100).toLocaleString(undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}${' '}₺`;
        return formattedPrice;

      }
    },
    listing_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "normalde urunun fiyati",
      get() {
        const formattedPrice = `${(this.getDataValue('listing_price') / 100).toLocaleString(undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}${' '}₺`;
        return formattedPrice;

      }
    },
    num_orders: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    participants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    instant_discount_percent: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    instant_price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      get() {
        const formattedPrice = `${(this.getDataValue('instant_price') / 100).toLocaleString(undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}${' '}₺`;
        return formattedPrice;

      }
    },
    instantPrice: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
    },
    target_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    downpayment: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    blocking_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'products',
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
        name: "seller",
        using: "BTREE",
        fields: [
          { name: "seller" },
        ]
      },
      {
        name: "products_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "model_id" },
        ]
      },
    ]
  });
};
module.exports = product;
