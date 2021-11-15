const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('return_reasons', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    reason_text: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    comment_required: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    formType: {
      type: DataTypes.ENUM('cancel','return','both'),
      allowNull: false,
      defaultValue: "both"
    }
  }, {
    sequelize,
    tableName: 'return_reasons',
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
    ]
  });
};
