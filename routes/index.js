const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { 
    catalogApi,
    locationsApi,
    ordersApi,
} = require('../util/square-client');

const router = express.Router();
const CatalogList = require('../models/catalog-list');
const LocationInfo = require('../models/location-info');

// router.use('/checkout', require('./checkout'));
// router.use('/order-confirmation', require('./order-confirmation'));

router.get('/', async (req, res, next) => {
    const types = "ITEM,IMAGE"; // retrieve ITEM & IMAGE CatalogObjects
    try {
        const { result: { locations } } = await locationsApi.listLocations(); // retrieve locations
        const { result: { objects } } = await catalogApi.listCatalog(undefined, types); // retrieve catalogItem & catalogImage

        res.render('index', {
            title: 'index',
            locationInfo: new LocationInfo(locations[0]),
            items: new CatalogList(objects).items
        })

    } catch (err) {
        next(err);
    }
})

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