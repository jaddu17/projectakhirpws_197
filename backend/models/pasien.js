// models/pasien.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pasien = sequelize.define('Pasien', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    no_telepon: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'pasien',
    timestamps: true
  });

  Pasien.associate = (models) => {
    Pasien.hasMany(models.JanjiTemu, { foreignKey: 'pasien_id' });
    Pasien.hasMany(models.RekamMedis, { foreignKey: 'pasien_id' });
  };

  return Pasien;
};