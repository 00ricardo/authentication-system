import { DataTypes } from 'sequelize'

const User = (sequelize) => {
  sequelize.define("auth_users", {
    name: DataTypes.TEXT,
    favoriteColor: {
      type: DataTypes.TEXT,
      defaultValue: 'green'
    },
    aaaa: DataTypes.INTEGER,
    cash: DataTypes.INTEGER
  }, {
    timestamps: false
  });
}

export default User