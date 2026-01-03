// models/rekamMedis.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const RekamMedis = sequelize.define('RekamMedis', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    catatan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tanggal: {
      type: DataTypes.DATEONLY,
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
    },
    janji_temu_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'janji_temu', key: 'id' }
    },
    tindakan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'tindakan', key: 'id' }
    }
  }, {
    tableName: 'rekam_medis',
    timestamps: true
  });

  RekamMedis.associate = (models) => {
    RekamMedis.belongsTo(models.Pasien, { foreignKey: 'pasien_id' });
    RekamMedis.belongsTo(models.Dokter, { foreignKey: 'dokter_id' });
    RekamMedis.belongsTo(models.JanjiTemu, { foreignKey: 'janji_temu_id' });
    RekamMedis.belongsTo(models.Tindakan, { foreignKey: 'tindakan_id' });
  };

  return RekamMedis;
};