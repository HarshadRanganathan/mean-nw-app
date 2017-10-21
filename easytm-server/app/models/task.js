///////////////////////////////////////////////////

//////// SCHEMA FOR TASKS /////////

/////////////////////////////////////////////////

// modules
var mongoose = require('mongoose');

// define task schema
/*
  1. Schema Type
  2. Required validator
  3. Enum validator
  4. Date
  5. Additional schema options
*/
var taskSchema = mongoose.Schema({
  assigneeId: { type: String, required: true },
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: true },
  taskStatus: { type: String, enum: ['NEW', 'COMPLETE', 'CURRENT', 'HOLD'] },
  taskLabels: [String],
  taskPriority: Boolean,
  assignerId: { type: String, required: true },
  assignerName: { type: String, required: true },
  taskStartTime: Date,
  taskEndTime: Date,
  taskHoldDuration: Number,
  totalDuration: Number,
  taskDuration: Number
},
  {
    collection: 'tasks', // collection name
    timestamps: true // create 'createdAt' and 'updatedAt' timestamps
  });

// create task model from schema
var Task = mongoose.model('Task', taskSchema);

// export model 'Task'
module.exports = Task;
