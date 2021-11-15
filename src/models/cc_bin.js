const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cc_bin', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bin: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: "bin"
    },
    pos_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_debit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bank_name: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    bank_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    card_type: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(512),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cc_bin',
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
        name: "bin",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bin" },
        ]
      },
    ]
  });
};
