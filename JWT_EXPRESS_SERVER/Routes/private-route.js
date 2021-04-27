const appRoute = require('express').Router();
const PrivateRouteController = require('../Controller/private-controller');
//checkc token
const tokenCheck = require('../Middlewares/authToken');

appRoute.get('/',tokenCheck.protect,PrivateRouteController.getPrivateData);

module.exports = appRoute;