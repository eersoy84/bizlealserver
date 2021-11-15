const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('app_response', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    execution: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    level: {
      type: DataTypes.ENUM('debug','warning','error'),
      allowNull: false,
      defaultValue: "debug"
    },
    file: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    line: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    headers: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    backtrace: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'app_response',
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
        name: "exec_idx",
        using: "BTREE",
        fields: [
          { name: "execution" },
        ]
      },
    ]
  });
};
