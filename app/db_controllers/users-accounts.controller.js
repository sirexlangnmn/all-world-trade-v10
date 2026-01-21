const db = require('../db_models');
const sequelizeConfig = require('../config/sequelize.config.js');

const Users_accounts = db.users_accounts;

const Op = db.Sequelize.Op;

exports.numberOfVisitorMembers = async (req, res) => {
    const getRows = await Users_accounts.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            return 'Some error occurred while retrieving number Of Trader Members.';
        });
};

exports.tradersData = async (req, res) => {
    const traders = { type: 1 };
    const large_scale = { type: 2 };
    const medium_scale = { type: 3 };
    const small_scale = { type: 4 };

    const smallScale = await Users_accounts.findAll({ where: small_scale });
    const mediumScale = await Users_accounts.findAll({ where: medium_scale });
    const largeScale = await Users_accounts.findAll({ where: large_scale });
    const Alltraders = await Users_accounts.findAll({ where: traders });

    let data = [];
    data = {
        'Number of Small Scale: ': smallScale.length,
        'Number of Medium Scale: ': mediumScale.length,
        'Number of Large Scale: ': largeScale.length,
        'Number of Trader: ': Alltraders.length,
        'All: ': Alltraders.length + smallScale.length + mediumScale.length + largeScale.length,
    };

    res.send(data);
};



// exports.checkIfTraderIsActive = async (req, res) => {
//     const traderUuid = { uuid: req.body.trader_uuid };
//     const data = await Users_accounts.findOne({
//             where: traderUuid,
//             attributes: ['login_Status']
//         });
//     console.log(`controller checkIfTraderIsActive response::: `, data.login_Status)
//     res.send(data.login_Status);
// };


exports.checkIfTraderIsActive = async (req, res) => {
    try {
        const traderUuid = { uuid: req.body.trader_uuid };
        const data = await Users_accounts.findOne({
            where: traderUuid,
            attributes: ['login_Status']
        });

        if (data) {
            const loginStatus = data.get('login_Status'); // Extract the login_Status value
            console.log(`controller checkIfTraderIsActive response::: `, loginStatus);
            res.send({ isActive: loginStatus });
        } else {
            console.log('controller checkIfTraderIsActive response::: Trader not found');
        }
    } catch (error) {
        console.error('Error in checkIfTraderIsActive:', error);
    }
};