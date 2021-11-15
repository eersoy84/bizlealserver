const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('phone_tokens', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    number: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    reason: {
      type: DataTypes.ENUM('add_number','password_reset','register','login'),
      allowNull: false
    },
    ref: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: "ref"
    },
    hash: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    state: {
      type: DataTypes.ENUM('created','invalidated','timed_out','used'),
      allowNull: false,
      defaultValue: "created"
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    tries: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ip: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    gsm_val: {
      type: DataTypes.STRING(32),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'phone_tokens',
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
          { name: "ref" },
        ]
      },
      {
        name: "ref",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ref" },
        ]
      },
      {
        name: "email_tokens_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
