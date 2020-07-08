const express = require('express');
const router = express.Router();
const userService = require('../service/userService');
const vacationService = require('../service/vacationService');

router.get('/user/:id', async (req, res, next) => {
  try {
    const result = await new userService().getUser(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { result, token } = await new userService().login(req.body);
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/vacation', async (req, res, next) => {
  try {
    const result = await new vacationService().createVacation(req.body);
    
    if(result === -1) {
      res.status(200).json({error: 'NoMoreVacationDays'});
    } else {
      res.status(200).json(result);
    }
    
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/vacation/:userId', async (req, res, next) => {
  try {
    const result = await new vacationService().getVacations(req.params);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/vacation/', async (req, res, next) => {
  try {
    const result = await new vacationService().cancelVacation(req.body.item);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
