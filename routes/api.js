const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { 
    catalogApi,
    locationsApi,
    ordersApi,
} = require('../util/square-client');

const router = express.Router();

router.get('/api/catalog/', async (req, res, next) => {
    const types = "ITEM,IMAGE";
    try {
     const { result: { objects } } = await catalogApi.listCatalog(undefined, types);
 
     res.json(objects);
     
     } catch (err) {
        next(err);
     }
    
});

 router.get('/api/locations/', async (req, res, next) => {
     try {
      const { result: { locations } } = await locationsApi.listLocations();
 
      res.json(locations);
      
      } catch (err) {
         next(err);
      }
});

module.exports = router;