const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('product_questions', {
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
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    user_question: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    user_question_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      get() {
        var date = this.getDataValue('user_question_date')
        if (date) return moment(date).locale('tr').format('Do MMMM, YYYY, h:mm a')
        else return null
      },
    },
    seller_answer: {
      type: DataTypes.STRING(2048),
      allowNull: true
    },
    seller_answer_date: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        var date = this.getDataValue('seller_answer_date')
        if (date) return moment(date).locale('tr').format('Do MMMM, YYYY, h:mm a')
        else return null
      }
    },
    question_approved: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    answer_approved: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'product_questions',
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
      {
        name: "product_id",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
    ]
  });
};
