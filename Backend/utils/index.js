const moment = require('moment');
const jwt = require('jsonwebtoken');
const config = require('../config');

const countVacationDays = (vacation) => {

    let startDate = vacation.startDate;
    let countDays = moment(vacation.endDate).diff(moment(startDate), 'days') + 1;
    let calculateDays = countDays;

    for (let i = 0; i < countDays; i++) {
        let weerkDay = moment(startDate).isoWeekday();
        if (weerkDay === 6 || weerkDay === 7) {
            calculateDays--;
        }
        startDate = moment(startDate).add(1, 'days');
    }

    return calculateDays;
}

const isCancelable = (startDate) => {
    return moment().isBefore(moment(startDate));
}

const validateVacationDays = (user, vacation) => {
    let canApplyVacation = true;
    const restVacationDays = user.totalVacationDays - user.usedVacationDays;

    if (restVacationDays <= 0 || restVacationDays < vacation.days) {
        canApplyVacation = false;
    }

    return { canApplyVacation };
}

const createToken = (user) => {
    if(user.length === 0) {
        return null;
    } else {
        const token = jwt.sign(
            { id: user.id }, 
            config.secretKey, 
            { expiresIn: '1h' }
        );
        return token;
    }
}

module.exports = {
    countVacationDays,
    isCancelable,
    validateVacationDays,
    createToken
}



