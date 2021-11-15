const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('seller', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.ENUM('created','registered','active','waiting_update'),
      allowNull: false,
      defaultValue: "created"
    },
    name: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      comment: "Şirket İsmi"
    },
    marketplace_name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    marketplace_logo: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    marketplace_uuid: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "hidden"
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "(1:Bireysel, 2:Şahıs şirketi, 3:Limited\/Anonim şirket)"
    },
    contact_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: "Şirket Yetkili İsmi"
    },
    tr_id_num: {
      type: DataTypes.STRING(24),
      allowNull: false,
      comment: "TC veya Vergi Numarası"
    },
    tax_office: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(24),
      allowNull: false,
      comment: "Üye işyeri GSM"
    },
    iban: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: "Üye İşyeri IBAN numarası"
    },
    adress: {
      type: DataTypes.STRING(1024),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'seller',
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
