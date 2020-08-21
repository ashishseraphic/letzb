"use strict";
module.exports = {
  secret: "P16s2vsj6BRyFUKomxXG",
  roles: {
    admin: 1,
    user: 2,
    vendor: 3,
  },
  // serverUrl: 'http://localhost:3000/',
  serverUrl: "https://letzb.herokuapp.com/",
  // serverUrl:'http://ec2-3-21-237-151.us-east-2.compute.amazonaws.com:5000/',
  // serverUrl: process.env.NODE_ENV === 'production' ? 'http://ec2-18-223-235-54.us-east-2.compute.amazonaws.com:3000/' : 'http://localhost:3000/',
  authPrefix: "JWT",
  sessionExpire: 15552000,
  facebook: {
    clientID: "1702426756565777",
    clientSecret: "a9b21085ba9049944838a9ed486325a6",
  },
  twilioConfig: {
    accountSid: "AC9a07e55e3bf3d6a37b39e73e56a122ac",
    accountAuth: "258a5423f00039c63b320d26bf3b4895",
  },
};
