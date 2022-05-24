import sequelize from './conn.js'
import User from '../models/Users.js'

User(sequelize)

const migrateModels = async () => {
    await sequelize.sync({ force: true });
}

migrateModels()