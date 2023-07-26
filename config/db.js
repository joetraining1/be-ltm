const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ltm', 'root', '', {
    dialect: 'mysql',
    host: 'localhost'
})

const init = () => {
    sequelize.sync({
        alter: true
    }).then(res => {
        console.log("Database Connected.")
    }).catch(err => console.log('Error Occured :', err))
}

const connect = async() => {
    try{
        await sequelize.authenticate();
        console.log('Database Connection Succesful.')
    }catch(error){
        console.error('Database Connection refused, error :', error)
    }
}

const closeDb = () => {
    sequelize.close();
    console.log('Database Disconnected.')
}

exports.sequelize = sequelize;
exports.init = init;
exports.connect = connect;
exports.closeDb = closeDb;

const { User } = require('../models/Users');
const Types = require('../models/Types');
const { Categories } = require('../models/Categories');
const { Product } = require('../models/Products');
const { CartDetail } = require('../models/CartDetails');
const { OrderDetail } = require('../models/OrderDetail');
const { Cart } = require('../models/Carts');
const { Order } = require('../models/Orders');
const { Bank } = require('../models/Banks');
const { BankAccount } = require('../models/BankAccounts');
const { Payment } = require('../models/Payments');
const { Status } = require('../models/Statuses');