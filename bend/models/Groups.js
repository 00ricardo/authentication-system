import { DataTypes } from 'sequelize'
import sequelize from '../db/conn.js'

const Groups = sequelize.define("auth_groups", {
  name: DataTypes.TEXT,
  favoriteColor: {
    type: DataTypes.TEXT,
    defaultValue: 'green'
  },
  age: DataTypes.INTEGER,
  cash: DataTypes.INTEGER
}, {
  timestamps: false
})

export default Groups