import { DataTypes } from 'sequelize'
import sequelize from '../db/conn.js'
import Group from './Groups.js'

const User = sequelize.define("user", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: false,
    primaryKey: true
  },
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
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  timestamps: false
});

export const UserToken = sequelize.define("token", {
  value: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  confirmation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {
  timestamps: false
})


User.belongsTo(Group)
UserToken.belongsTo(User)

export default User