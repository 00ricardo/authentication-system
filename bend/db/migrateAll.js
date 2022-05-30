import sequelize from './conn.js'
import User from '../models/Users.js'
import Groups from '../models/Groups.js'




const migrateModels = async () => {
    User(sequelize)
    Groups(sequelize)
    await sequelize.sync({ force: true });
}

migrateModels()