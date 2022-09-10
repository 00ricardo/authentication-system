import { DataTypes } from 'sequelize'
import sequelize from '../db/conn.js'

const Group = sequelize.define("group", {
  name: DataTypes.TEXT
}, {
  timestamps: false
})

export default Group