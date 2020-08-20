'use strict';

/**
 * Module dependencies.
 */
let mongoose = require('./db.server.connect'),
    Schema = mongoose.Schema,
    _ = require('underscore'),
    crypto = require('crypto'),
    appConstants=require('../../constansts'),
	config = require('../../config.server');

/**
 * A Validation function for local strategy password
 */
let validateLocalStrategyPassword = function (password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
let UserSchema = new Schema({
    username: {
		type: String,
		// unique: true,
		match: [/^[a-z0-9_-]{3,15}$/, 'Please choose valid username'],

	},
	email: {
		type: String,
		trim: true,
		default: '',
		match: [/.+\@.+\..+/, 'Please fill a valid email address'],
		unique: true
    },
    phoneNumber:{
        type:String,
        // unique: true
    },
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	isEmailVerified: {
		type: Boolean,
		default:false,
    },
    isMobileVerified:{
        type:Boolean,
        default: false,
    },
    userData: {
		model: { type: String },
		data: { type: Schema.ObjectId, refPath: 'userData.model' }
	},
    profileImages:{
        type:String,
        max :255,
        default: ""
    },
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	verifyEmailToken:{
		type: String
	},
	verifyEmailExpires:{
		type: Date
    },
    verifyMobileOtp:{
        type: String
    },
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
    },
    provider:{
        type: String,
    },
    
	facebookProvider: {
        type: {
            id: String,
            token: String,
            displayName: String,
            gender: String,
        },
        select: false
    },

	salt: {
		type: String
	},
	roles: {
		type: [{
			type: Number,
			enum: [config.roles.admin, config.roles.user, config.roles.vendor]
		}],
		required: "User must assigned a role"
	},
	isDeleted: {
		type: Boolean,
		default: false
    },

    isPasswordSet:{
        type: Boolean,
        default:false
    },
    birthday: {
        type: Date
    },
    hasAnsweredQuestions:{
        type:Boolean,
        default: false
    },
    // answersArray:[{
    //     questionId:{
    //         type: Number,
    //         // ref: 'questions'
    //     },
    //     answerId:{
    //         type: Number
    //     }
    // }],
    venueName: {
        type: String
    }
});
/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
	if (this.password && this.password.length > 3) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
	return this.password === this.hashPassword(password);
};
//Facebook User

UserSchema.statics.upsertFbUser = function (accessToken, profile, deviceTokens, cb) {
    var that = this;
    return this.findOne({
        'facebookProvider.id': profile.id
    }, function (err, user) {
        // console.log("Profile here". user)
        console.log("profile", profile)
        if (!user) {
            var newUser = new that({
                roles:[2],
                firstName: "",
                lastName: "",
                isPasswordSet:false,
                email:   profile.email ,
                name: profile.name,
                facebookProvider: {
                    id: profile.id,
                    token: accessToken,
                    name: profile.name,
                },
                provider: 'facebook',
                deviceTokens,               
            });
            newUser.save(function (errorsave, savedUser) {
                
                if (errorsave) {
                    console.log(errorsave);
                }
                // console.log("SavedUser", savedUser)

                return cb(errorsave, savedUser);
            });
        } else {
          
            let deiveTokens = profile.id.deviceTokens || [];

            if (_.findWhere(deiveTokens, deviceTokens) == null) {
                deiveTokens.push(deviceTokens);
            }

            that.findOneAndUpdate({ _id: user.id }, { $set: { deviceTokens: deiveTokens } },{new: true},(err, res)=> {
          
                return cb(err, res );
            })
        }
    });
};



module.exports = mongoose.model('User', UserSchema);