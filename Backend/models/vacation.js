module.exports = function (sequelize, DataTypes) {
    const vacation = sequelize.define('Vacation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        days: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        cancelable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isCancelled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }, {
        tableName: 'Vacation',
        indexes: [
            {
                unique: false,
                fields: ['userId']
            }
        ]
    });

    return vacation;
}