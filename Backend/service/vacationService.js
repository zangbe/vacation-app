const models = require('../models/index');
const { sequelize } = require('../models/index');
const { countVacationDays, isCancelable, validateVacationDays } = require('../utils/index');
const userService = require('./userService');

module.exports = class VacationSerivce {
    async createVacation(vacation) {
        try {

            vacation.days = countVacationDays(vacation);

            const user = await new userService().getUser(vacation.userId);

            const { canApplyVacation } = validateVacationDays(user[0], vacation);

            if (canApplyVacation) {
                const result = sequelize.transaction(async (t) => {
                    const vacationRecord = await models.Vacation.create({
                        userId: vacation.userId,
                        startDate: vacation.startDate,
                        endDate: vacation.endDate ? vacation.endDate : vacation.startDate,
                        days: vacation.days,
                        cancelable: isCancelable(vacation.startDate),
                        isCancelled: 0
                    }, { transaction: t });

                    // 같은 트랜잭션에서 처리하기 위해 호출
                    return await new userService().increaseUserVacationDays(t, vacationRecord);
                })

                return result;
            } else {
                return -1;
            }

        } catch (error) {
            throw new Error(error);
        }
    }

    async getVacations(user) {
        try {
            return await sequelize.transaction(async (t) => {
                return await models.Vacation.findAll({
                    where: {
                        userId: user.userId,
                        isCancelled: 0
                    }
                }, { transaction: t });
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async cancelVacation(vacation) {
        try {
            return await sequelize.transaction(async (t) => {
                await models.Vacation.update({
                    'cancelable': 0,
                    'isCancelled': 1
                }, {
                    where: {
                        id: vacation.id
                    },
                    transaction: t
                });

                // 같은 트랜잭션에서 처리하기 위해 호출
                return await new userService().decreaseUserVacationDays(t, vacation);
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}