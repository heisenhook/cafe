const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { 
    catalogApi,
    locationsApi,
    ordersApi,
} = require('../util/square-client');

const router = express.Router();

function convertBigIntToString(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'bigint') {
        obj[key] = obj[key].toString();
      } else if (typeof obj[key] === 'object') {
        obj[key] = convertBigIntToString(obj[key]);
      }
    }
    return obj;
}
  
router.get('/catalog/', async (req, res, next) => {
    const types = "ITEM,IMAGE,CATEGORY,MODIFIER_LIST";
    try {

        const { result: { objects } } = await catalogApi.listCatalog(undefined, types);
        const data = objects.map(obj => convertBigIntToString(obj));
        res.json(data);

    } catch (err) {

        next(err);
        
    }
});
  

 router.get('/locations/', async (req, res, next) => {
    try {
        const { result: { locations } } = await locationsApi.listLocations();

        res.json(locations);

    } catch (err) {
        next(err);
    }
});

module.exports = router;