// models/user.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'dokter'),
      allowNull: false
    },
    api_key: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    // Tambahkan kolom ini
    dokter_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'dokter', key: 'id' }
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  return User;
};