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
    const types = "ITEM,IMAGE";
    try {
        const { result: { objects } } = await catalogApi.listCatalog(undefined, types);
        const data = objects.map(obj => convertBigIntToString(obj));
        const items = [];

        for (let i = 0; i < data.length; i++) {
          const currentItem = data[i];
        
          if (currentItem.type === 'ITEM') {
            const pair = {
              item: currentItem,
              image: null,
            };
        
            const imageId = currentItem.itemData.imageIds[0];
            const matchingImage = data.find(item => item.type === 'IMAGE' && item.id === imageId);
        
            if (matchingImage) {
              pair.image = matchingImage;
            }
        
            items.push(pair);
          }
        }

        res.json(items);
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