// models/dokter.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Dokter = sequelize.define('Dokter', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    spesialis: {
      type: DataTypes.STRING,
      allowNull: true
    },
    no_telepon: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'dokter',
    timestamps: true
  });

  Dokter.associate = (models) => {
    Dokter.hasMany(models.JanjiTemu, { foreignKey: 'dokter_id' });
    Dokter.hasMany(models.RekamMedis, { foreignKey: 'dokter_id' });
    Dokter.hasOne(models.User, { foreignKey: 'dokter_id', as: 'user' });
  };

  return Dokter;
};