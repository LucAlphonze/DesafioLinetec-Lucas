'use strict'
require('dotenv').config({ path: "../../.env" });
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres_database', 'postgres_user', 'postgres_password', {
    host: 'postgres',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        //timezone: process.env.DB_TIMEZONE
        //socketPath: '/var/run/mysqld/mysqld.sock'
    }
    /*,
        define: { //eliminates createdAt & updatedAt
            timestamps: false,
        }*/
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.data = require('../models/data.js')(sequelize, Sequelize);

sequelize.sync()
    .then(async() => {
        console.log('Models are up');
        console.log('Checking data...');
        try {
            var data = await db.data.findOne({});
            if (!data) {
                console.log('Inserting data...');
                for (var i = 0; i < 1000; i++) {
                    await db.data.create({
                        Tension_L1_N: (Math.random() * (230 - 220)) + 220,
                        Tension_L2_N: (Math.random() * (230 - 220)) + 220,
                        Tension_L3_N: (Math.random() * (230 - 220)) + 220,
                        Corriente_L1: (Math.random() * (60 - 40)) + 40,
                        Corriente_L2: (Math.random() * (60 - 40)) + 40,
                        Corriente_L3: (Math.random() * (60 - 40)) + 40,
                        Potencia_Activa_Total_P: (Math.random() * (25000 - 15000)) + 15000,
                        Potencia_Aparente_Total_S: (Math.random() * (25000 - 15000)) + 15000,
                        Potencia_Reactiva_Total_Q: (Math.random() * (25000 - 15000)) + 15000,
                        Energia_Activa: (Math.random() * (15000 - 10000)) + 10000,
                        Energia_Aparente: (Math.random() * (15000 - 10000)) + 10000,
                        Energia_Reactiva: (Math.random() * (15000 - 10000)) + 10000,
                        Factor_de_Potencia_Total: (Math.random() * (0.99 - 0.60)) + 0.60,
                        TIMESTAMP: new Date().getTime(),
                    });
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }).catch(error => console.log('This error occured', error));

module.exports = db;