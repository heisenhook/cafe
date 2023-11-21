const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { 
    catalogApi,
    locationsApi,
    ordersApi,
} = require('../util/square-client');

const router = express.Router();

router.get('/catalog/', async (req, res, next) => {
    const types = "ITEM,IMAGE";
    try {
     const { result: { objects } } = await catalogApi.listCatalog(undefined, types);
 
     const objectsStringified = objects.map(obj => {
       if (typeof obj.version === 'bigint') {
         obj.version = obj.version.toString();
       }
       return obj;
     });
 
     res.json(objectsStringified);
     
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