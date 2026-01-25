module.exports = (sequelize, Sequelize) => {
    const Contact_requests = sequelize.define('contact_requests', {
        trader_id: {
            type: Sequelize.STRING,
        },
        visitor_id: {
            type: Sequelize.STRING,
        },
        message: {
            type: Sequelize.STRING,
        },
        cratedAt: {
            type: Sequelize.DATE,
        },
    });

    return Contact_requests;
};
