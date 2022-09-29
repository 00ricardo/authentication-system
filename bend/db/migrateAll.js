import sequelize from './conn.js'
import User, { UserToken } from '../models/Users.js';
import Groups from '../models/Groups.js';

// -- //
import { users, groups } from './dumpbd.js'

const migrateModels = async () => {
    await sequelize.sync({ force: true });

    users.forEach(async (usr) => {
        await User.create(usr)
    });

    groups.forEach(async (gp) => {
        await Groups.create(gp)
    });

    await UserToken.destroy({ where: { userId: null } })
}

migrateModels()