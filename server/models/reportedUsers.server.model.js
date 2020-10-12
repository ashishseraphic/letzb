"use strict";

const constansts = require("../constansts");

/**
 * Module dependencies.
 */
let mongoose = require("./db.server.connect"),
  Schema = mongoose.Schema,
  _ = require("underscore"),
  crypto = require("crypto"),
  constant = require("../constansts"),
  config = require("../config.server");

/**
 * Reported User Schema
 */
let ReportedUserSchema = new Schema({
  reportedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("ReportedUser", ReportedUserSchema);
