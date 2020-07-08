const models = require('../models/index');
const { sequelize } = require('../models/index');
const { createToken } = require('../utils/index');

module.exports = class UserSerivce {
    async getUser(id) {
        try {
            const result = await sequelize.transaction(async (t) => {
                const userRecord = await models.User.findAll({
                    where: {
                        id: id,
                    }
                }, { transaction: t });
                return userRecord;
            });

            return result;
        } catch (error) {
            throw new Error(error);
        }
    }
    
    async login(user) {
        try {
            const result = await sequelize.transaction(async (t) => {
                const userRecord = await models.User.findAll({
                    attributes: ['id', 'userId', 'totalVacationDays', 'usedVacationDays'],
                    where: {
                        userId: user.userId,
                        password: user.password
                    }
                }, { transaction: t });

                return userRecord;
            });

            const token = createToken(result);
            return {result, token};
        } catch (error) {
            throw new Error(error);
        }
    }

    async increaseUserVacationDays(transaction, vacation) {
        try {
            return await models.User.increment('usedVacationDays', {
                by: vacation.days,
                where: {
                    id: vacation.userId
                }
            }, { transaction: transaction });
        } catch (error) {
            throw new Error(error);
        }
    }

    async decreaseUserVacationDays(transaction, vacation) {
        try {
            return await models.User.decrement('usedVacationDays', {
                by: vacation.days,
                where: {
                    id: vacation.userId
                }
            }, { transaction: transaction });
        } catch (error) {
            throw new Error(error);
        }
    }
}