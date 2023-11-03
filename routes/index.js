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
            /**
             * todo: implement when frontend exists lol
             * 
             * items: new CatalogList(objects).items,
             * locationInfo: new LocationInfo(locations[0]),
             * 
            */
        })

    } catch (err) {
        next(err);
    }
})

module.exports = router;