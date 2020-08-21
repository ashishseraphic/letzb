var admin = require('firebase-admin');

var serviceAccount = require('../letzb-6a3a2-firebase-adminsdk-z5kbp-c69dd6f2d7.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ""
})

module.exports.admin = admin