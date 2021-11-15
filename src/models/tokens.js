const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tokens', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    token: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: "token"
    },
    hash: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    notif_token: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      unique: "notif_token"
    },
    client: {
      type: DataTypes.STRING(42),
      allowNull: false
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tokens',
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
        name: "token",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "token" },
        ]
      },
      {
        name: "notif_token",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "notif_token" },
        ]
      },
      {
        name: "tokens_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "user" },
        ]
      },
    ]
  });
};
