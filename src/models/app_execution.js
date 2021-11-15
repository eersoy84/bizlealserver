const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('app_execution', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    client: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    server: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    user_agent: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    get_params: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    post_params: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    headers: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    protocol: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "UNDEFINED"
    },
    user: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'app_execution',
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
        name: "id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_agent",
        using: "BTREE",
        fields: [
          { name: "user_agent" },
        ]
      },
    ]
  });
};
