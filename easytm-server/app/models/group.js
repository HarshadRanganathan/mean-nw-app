///////////////////////////////////////////////////

//////// SCHEMA FOR USER GROUPS /////////

/////////////////////////////////////////////////

// modules
var mongoose = require('mongoose');
var User = require('./user')

// define task schema
/*
  1. Schema Type
  2. Required validator
  3. Schema reference
  4. Additional schema options
*/
var groupSchema = mongoose.Schema({

  leaderId: { type: String, required: true },
  groupName: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deleted: { type: Boolean, default: false }

},
  {
    collection: 'groups', // collection name
    timestamps: true // create 'createdAt' and 'updatedAt' timestamps
  });

// create group model from schema
var Group = mongoose.model('Group', groupSchema);

// export model 'Group'
module.exports = Group;
