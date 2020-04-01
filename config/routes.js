/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/


  'GET /': 'RentalController.mainpage',
  'GET /rental/update/:id': 'RentalController.update',
  'POST /rental/update/:id': 'RentalController.update',
  'DELETE /rental/:id': 'RentalController.delete',
  'GET /rental/detail/:id': 'RentalController.detail',

  'GET /user/login': 'UserController.login',
  'POST /user/login': 'UserController.login',
  'POST /user/logout': 'UserController.logout',

  'GET /rental/:id/rentby': 'RentalController.populate',
  'GET /rental/:id/rentbyjson': 'RentalController.rentbyjson',
  'GET /user/:id/livein': 'UserController.populate',
  'GET /user/:id/liveinjson':'UserController.liveinjson',
  'POST /user/:id/livein/add/:fk': 'UserController.add',
  'POST /user/:id/livein/remove/:fk': 'UserController.remove',


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
