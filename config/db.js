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
const { Type } = require('../models/Types');
const { Categories } = require('../models/Categories');
const { Product } = require('../models/Products');
const { CartDetail } = require('../models/CartDetails');
const { OrderDetail } = require('../models/OrderDetail');
const { Cart } = require('../models/Carts');

OrderDetail.belongsTo(Product, {
    foreignKey: {
        name: 'product_id'
    }
})

Cart.hasMany(CartDetail, {
    foreignKey: {
        name: 'cart_id'
    },
    onDelete: 'CASCADE'
})
CartDetail.belongsTo(Product, {
    foreignKey: {
        name: 'product_id'
    }
})

Categories.hasMany(Product, {
    foreignKey: {
        name: 'ctg_id',
    },
});
Product.belongsTo(Categories, {
    foreignKey: {
        name: 'ctg_id'
    }
})
Product.hasMany(CartDetail, {
    foreignKey: {
        name: 'product_id'
    }
})
Product.hasMany(OrderDetail, {
    foreignKey: {
        name: 'product_id'
    }
})

Type.hasMany(User, {
    foreignKey: {
        name: 'type_id',
    },
})
User.belongsTo(Type, {
    foreignKey: {
        name: 'type_id',
    }
})