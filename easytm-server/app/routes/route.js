// modules
var express = require('express');
var query = require('../queries/query')
var auth = require('../auth/auth')
var router = express.Router();

// middleware specific to this router
router.use(function (req, res, next) {
  console.log('Time: ', Date.now());

  // CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }

});

/*
* Authentication Token
*/
router.post('/rest/authentication', auth.getToken);

/*
* Authenticate all requests with token
*/
router.use(function authenticate(req, res, next) {
  auth.verifyToken(req, res, next);
});


/*
* TASK
*/

router.get('/task/all', query.getAllTasks);
router.post('/task/new', query.createTask);
router.post('/task/:taskId/current', query.changeToCurrentState);
router.post('/task/:taskId/hold', query.changeToHoldState);
router.post('/task/:taskId/complete', query.changeToCompleteState);

/*
* USER
*/

router.post('/user/new', query.createUser);
router.get('/user/search', query.getUsers);
router.get('/user/search/:userId', query.userCheck);
router.get('/user/:userId', query.getUserById);

/*
* GROUP
*/

router.post('/group/new', query.createGroup);
router.post('/group/add', query.addUsersToGroup);
router.post('/group/:groupId/delete', query.deleteGroup);

router.get('/group/:groupId', query.getGroupDetailsById);
router.get('/groups/:leaderId', query.getGroupsById);


module.exports = router;
