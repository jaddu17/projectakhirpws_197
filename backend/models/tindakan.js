// models/tindakan.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tindakan = sequelize.define('Tindakan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    biaya: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    }
  }, {
    tableName: 'tindakan',
    timestamps: true
  });

  Tindakan.associate = (models) => {
    Tindakan.hasMany(models.RekamMedis, { foreignKey: 'tindakan_id' });
  };

  return Tindakan;
};