///////////////////////////////////////////////////

//////// Mongo Queries /////////

/////////////////////////////////////////////////

var Task = require('../models/task')
var User = require('../models/user')
var Group = require('../models/group')
var moment = require('moment')

////////////////////////////////////////////////

////////// TASK ////////////////

///////////////////////////////////////////////

/*
  OPERATIONS
  1. Create new task for particular user
  2. Display all tasks
  3. Task state ops
*/

/*
  Work : Add new task to tasks collection.
         Add the task id to the list of user's tasks in users collection.
*/
exports.createTask = function (req, res) {
  var input = req.body;
  new Task({
    assigneeId: input.assigneeId,
    taskName: input.taskName,
    taskDescription: input.description,
    taskStatus: input.status,
    taskLabels: input.labels,
    taskPriority: input.priority,
    assignerId: input.userId,
    assignerName: input.userName
  }).save()

    .then(function (task) {
      // push new task to user's task array
      return User.findOneAndUpdate({ userId: input.assigneeId }, { $addToSet: { tasks: task._id } }).exec()
        .then(function (err, user) {
          return res.send(task);
        });
    });
}

// to get all tasks
exports.getAllTasks = function (req, res) {
  Task.find(function (err, tasks) {
    if (err) return console.error(err);
    res.send(tasks);
  })
}

/*
  Work : Find task whose state is to be changed.
         Calculate task start time and hold duration.
         Save task state in tasks collection.
         Send updated task in response
*/
exports.changeToCurrentState = function (req, res) {
  var taskId = req.param('taskId');

  Task.findById(taskId).exec()

    .then(function (task) {
      task.taskStatus = 'CURRENT';
      if (task.taskStartTime) {
        // existing task - calculate hold duration to subtract with total duration when task is closed
        task.taskHoldDuration = task.taskHoldDuration + (moment(new Date()).diff(moment(task.taskEndTime)))
          || moment(new Date()).diff(moment(task.taskEndTime));
      } else {
        // new task - set task start time
        task.taskStartTime = new Date();
      }
      return task;
    })

    .then(function (task) {
      return task.save();
    })

    .then(function (task) {
      return res.send(task);
    })
}

// state - HOLD

exports.changeToHoldState = function (req, res) {
  var taskId = req.param('taskId');

  Task.findById(taskId, function (err, task) {
    if (err) return console.error(err);

    // set end time, calculate total duration and change status to hold
    task.taskEndTime = new Date();
    task.totalDuration = moment(task.taskEndTime).diff(moment(task.taskStartTime));
    task.taskStatus = 'HOLD';

    return task.save()
      .then(function (doc) {
        return res.send(doc);
      })
  })
}

// state - COMPLETE

exports.changeToCompleteState = function (req, res) {
  var taskId = req.param('taskId');

  Task.findById(taskId, function (err, task) {
    if (err) return console.error(err);

    // set end time, calculate total duration, task duration and change status to COMPLETE
    task.taskEndTime = new Date();
    task.totalDuration = moment(task.taskEndTime).diff(moment(task.taskStartTime));

    if (task.taskHoldDuration) {
      // subtract total task time with hold time only if hold duration available
      task.taskDuration = task.totalDuration - task.taskHoldDuration;
    } else {
      task.taskDuration = task.totalDuration;
    }
    task.taskStatus = 'COMPLETE';

    return task.save()
      .then(function (doc) {
        console.log(JSON.stringify(doc));
        return User.findOneAndUpdate({ userId: doc.assigneeId }, { $pull: { tasks: task._id } }, function (err, doc) {
          return res.send(doc);
        })
      });
  })
}


////////////////////////////////////////////////

////////// USER ////////////////

///////////////////////////////////////////////
/*
  OPERATIONS
  1. Create new user
  2. Get user's task details
*/

// To create a new user
exports.createUser = function (req, res) {
  var input = req.body; // get request body

  // create new document
  new User({
    userId: input.userId,
    name: input.name,
    email: input.email
  }).save()
    .then(function (user) {
      return res.send('User Added');
    })
}

// get all user email's for search
exports.getUsers = function (req, res) {
  User.find({}, { email: 1 }).exec(function (err, list) {
    return res.send(list);
  })
}

// check whether user exists
exports.userCheck = function (req, res) {
  var id = req.param('userId');

  User.findOne({ userId: id })
    .exec(function (err, user) {
      if (user) {
        return res.json({ success: true, result: 'User available' });
      } else {
        return res.json({ success: false, result: 'User not available' })
      }
    })
}

// get user details with tasks
exports.getUserById = function (req, res) {
  var id = req.param('userId');

  User.findOne({ userId: id })
    .populate('tasks') // get user's tasks
    .exec(function (err, userTaskDetails) {
      return res.send(userTaskDetails);
    })
}


////////////////////////////////////////////////

////////// GROUP ////////////////

///////////////////////////////////////////////
/*
  OPERATIONS
  1. Create new group with users
  2. Add additional users to existing group
  3. View details of particular group
*/

// To create a new group
exports.createGroup = function (req, res) {
  var input = req.body; // get request body

  // create new document
  var group = new Group({
    leaderId: input.userId,
    groupName: input.groupName
  })

  input.users.forEach(function (element, index) {
    group.users.addToSet(element._id);
  })

  group.save(function (err) {
    if (err) return res.send(err);
    res.send(group);
  })
}

// add users to existing group
exports.addUsersToGroup = function (req, res) {
  var input = req.body;

  var users = new Array();
  input.users.forEach(function (element, index) {
    users.push(element._id);
  });

  Group.findOneAndUpdate({ _id: input.groupId }, { $addToSet: { users: { $each: users } } }, function (err, doc) {
    if (err) return console.error(err);
    res.send("New users added");
  })
}

// find active groups of user
exports.getGroupsById = function (req, res) {
  var id = req.param('leaderId');

  Group.find({ leaderId: id, deleted: false }, function (err, group) {
    if (err) return console.error(err);
    res.send(group);
  })
}

// get group user's task details
exports.getGroupDetailsById = function (req, res) {
  var groupId = req.param('groupId');

  Group.findById(groupId)
    .populate({
      path: 'users',
      populate: { path: 'tasks', model: 'Task' }
    }) // get user's tasks
    .exec(function (err, userTaskDetails) {
      return res.send(userTaskDetails);
    })
}

// soft delete particular group
exports.deleteGroup = function (req, res) {
  var groupId = req.param('groupId');

  Group.findOneAndUpdate({ _id: groupId }, { $set: { deleted: true } }, function (err, doc) {
    if (err) return console.error(err);
    res.send("Group Deleted");
  });
}
