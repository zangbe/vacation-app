module.exports = function (sequelize, DataTypes) {
    const user = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        totalVacationDays: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        usedVacationDays: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        }
    }, {
        tableName: 'User'
    });

    return user;
}