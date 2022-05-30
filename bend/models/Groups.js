import { DataTypes } from 'sequelize'

const Groups = (sequelize) => {
  sequelize.define("auth_groups", {
    name: DataTypes.TEXT,
    groups: DataTypes.INTEGER
  }, {
    timestamps: false
  });
}

export default Groups