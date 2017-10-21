///////////////////////////////////////////////////

//////// SCHEMA FOR USER /////////

/////////////////////////////////////////////////

// modules
var mongoose = require('mongoose');
var Task = require('./task')

// define task schema
/*
  1. Schema Type
  2. Required validator
  3. Schema reference
  4. Additional schema options
*/
var userSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
},
  {
    collection: 'user', // collection name
    timestamps: true // create 'createdAt' and 'updatedAt' timestamps
  });

// create user model from schema
var User = mongoose.model('User', userSchema);

// export model 'User'
module.exports = User;
