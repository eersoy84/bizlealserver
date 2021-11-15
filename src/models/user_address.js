const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_address', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    superseded_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "hidden"
    },
    hidden: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    address_title: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    is_corporate: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    district: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    address_text: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    town: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    company_name: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    tax_number: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    tax_office: {
      type: DataTypes.STRING(32),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_address',
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
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
