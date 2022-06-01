import { DataTypes } from 'sequelize'
import sequelize from '../db/conn.js'


const User = sequelize.define("auth_user", {
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_staff: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  first_name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  last_name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: false
});


export default User