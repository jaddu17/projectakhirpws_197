// models/janjiTemu.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const JanjiTemu = sequelize.define('JanjiTemu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    jam: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('menunggu', 'selesai', 'batal'),
      defaultValue: 'menunggu',
      allowNull: false
    },
    pasien_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'pasien', key: 'id' }
    },
    dokter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'dokter', key: 'id' }
    }
  }, {
    tableName: 'janji_temu',
    timestamps: true
  });

  JanjiTemu.associate = (models) => {
    JanjiTemu.belongsTo(models.Pasien, { foreignKey: 'pasien_id',as: 'pasien' });
    JanjiTemu.belongsTo(models.Dokter, { foreignKey: 'dokter_id',as: 'dokter' });
    JanjiTemu.hasOne(models.RekamMedis, { foreignKey: 'janji_temu_id' });
  };

  return JanjiTemu;
};