const express = require('express');
const categoryRoute = require('./categoryRoute')
const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const cartRoute = require('./cartRoute')
const orderRoute = require('./orderRoute')
const routinRoute = require('./routineRoute')
const itemRoute = require('./itemRoute')
const sellerRoute = require('./sellerRoute')
const swaggerRoute = require('./swaggerRoute')
const config = require('../config/config');

const router = express.Router();

const routes = [
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/cart',
    route: cartRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/routines',
    route: routinRoute,
  },
  {
    path: '/item',
    route: itemRoute,
  },
  {
    path: '/seller',
    route: sellerRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/swagger',
    route: swaggerRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
