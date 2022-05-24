import 'dotenv/config'
import fs from 'fs'
import { Sequelize } from 'sequelize'

var ctx = JSON.parse(fs.readFileSync('./ctx.json').toString());

const sequelize = new Sequelize(ctx.PG_DB, ctx.PG_USER, ctx.PG_PASS, {
    host: ctx.PG_HOST,
    dialect: 'postgres',
    port: ctx.PG_PORT
});

export default sequelize