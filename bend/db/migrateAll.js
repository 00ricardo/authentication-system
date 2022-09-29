import sequelize from './conn.js'
import User, { UserToken } from '../models/Users.js';
import Groups from '../models/Groups.js';

// -- //
import { users, groups } from './dumpbd.js'

const migrateModels = async () => {
    await sequelize.sync({ force: true });

    groups.forEach(async (gp) => {
        await Groups.create(gp)
    });

    users.forEach(async (usr) => {
        await User.create(usr)
    });

    await UserToken.destroy({ where: { userId: null } })
}

migrateModels()