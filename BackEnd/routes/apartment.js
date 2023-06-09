const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validator = require('../Utils/validator');
const {
  newApartment,
  viewApartment,
  viewApartmentById,
  updateApartment,
  deleteApartment,
  getAllApartment,
  getApartmentCount,
  getRegisteredApartment,
  getPendingApartment
} = require('../Controller/apartment-Controller');
const authGuard  = require('../Utils/authGuard')

router.post(
  '/add',
  validator([
    body('apartmentno').exists().isLength(3),
    body('floor').exists().isLength(2),
    body('buildingNo').isAlpha(),
    body('email').isEmail().normalizeEmail(),
  ]),
  newApartment
);

router.get('/view',viewApartment);

router.get('/getById/:id', viewApartmentById);

router.put('/update/:_id',validator([
  body('email').isEmail().normalizeEmail(),
]),updateApartment);

router.delete('/delete/:_id',deleteApartment);
router.get('/allApartment', getAllApartment)

router.get('/apartmentCount', getApartmentCount);
router.get('/registeredApartments',getRegisteredApartment);
router.get('/pendingCount', getPendingApartment);

module.exports = router;
