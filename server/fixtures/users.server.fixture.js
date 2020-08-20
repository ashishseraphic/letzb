'use strict';

/*
 *	Add Admin user by fixture
 */

let models = require('../oauth/models'),
    config = require('../config.server');

let moreFunctions = {
    fixtureUser: async () => {
        try {
            let res = await models.users.findOne({ roles: { $in: [config.roles.admin] } })
            if (res === null) {
                let admin = await models.adminProfile.create({
                    "firstName": "admin",
                    "lastName": "admin"
                })
                admin.provider = 'local';

                console.log("Fixture Admin created successfully");
                let user = models.users.create({
                    "email": "admin@letzbe.com",
                    "password": "letzbe@123",
                    "roles": [1],
                    "isEmailVerified":true,
                    "isMobileVerified":true,
                    userData: {
                        model: "adminProfile",
                        data: admin._id
                    }
                });
                user.provider = 'local';

                console.log("Fixture user created successfully", user._id)
            }
        } catch (err) {
            console.log("error", err);
        }
    }
}

module.exports = moreFunctions;
