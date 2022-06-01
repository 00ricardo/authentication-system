import 'dotenv/config'
import path from 'path';
import fs from 'fs'
import { Sequelize } from 'sequelize'
import { fileURLToPath } from 'url';

const f = fileURLToPath(import.meta.url);
const __dirname = path.dirname(f);
var ctx = JSON.parse(fs.readFileSync(`${__dirname}\\ctx.json`).toString());



const sequelize = new Sequelize(ctx.PG_DB, ctx.PG_USER, ctx.PG_PASS, {
    host: ctx.PG_HOST,
    dialect: 'postgres',
    port: ctx.PG_PORT
});

export const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('\nPostgreSQL: Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    return sequelize
}

export default sequelize

