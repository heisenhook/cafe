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

