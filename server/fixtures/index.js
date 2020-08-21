let fixture = require('./users.server.fixture');

module.exports = {
    userFixture: fixture
};



// updateProfile: (req, res, next) => {
//     imageUpload(req, res, err => {
//       if (err) {
//         return res.status(500).send({
//           message: "Error uploading image."
//         });
//       }

//       let update = {};

//       if (req.body.name) {
//         update["name"] = req.body.name;
//       }

//       if (req.body.phone) {
//         update["phoneNo"] = req.body.phone;
//       }

//       if (req.file) {
//         update["profilePic"] = req.file.location;
//       }<
//       var emailToken = gatewayServices.makeid(50);
//       if (req.body.email && req.body.email != req.user.email) {
//         update["newEmail"] = req.body.email;
//         update["emailToken"] = emailToken;
//       }

//       UserSchema.find({
//         $or: [
//           { email: req.body.email },
//           {
//             $and: [
//               {
//                 newEmail: {
//                   $exists: true
//                 }
//               },
//               { newEmail: req.body.email }
//             ]
//           }
//         ]
//       })
//         .then(result => {
//           result = JSON.parse(JSON.stringify(result));
//           if (result.length && result[0]._id != req.user._id) {
//             if (result.length > 1 && result[1]._id != req.user._id) {
//               return res.status(500).send({ message: "Email already Exists" });
//             }
//             return res.status(500).send({ message: "Email already Exists" });
//           }
//           UserSchema.findOneAndUpdate(
//             {
//               _id: req.user._id,
//               role: {
//                 $nin: ["1"]
//               }
//             },
//             {
//               $set: update
//             },
//             {
//               new: true
//             }
//           )
//             .then(updates => {
//               updates = JSON.parse(JSON.stringify(updates));

//               if (req.body.email && req.body.email != req.user.email) {
//                 var emailHTML =
//                   "<!DOCTYPE html>" +
//                   "<html>" +
//                   "<body>" +
//                   "<p>Dear " +
//                   req.user.name +
//                   "</p>" +
//                   "<p>To update your profile please click on below link</p>" +
//                   '<p><a href="' +
//                   Config.url +
//                   "v2/update_email?emailToken=" +
//                   emailToken +
//                   '" style="background: #6C38BB;color: white;padding: 15px 20px;border-radius: 30px;text-decoration: none;display: inline-block;">Click here to update Email address</a></p>' +
//                   "<p>" +
//                   "Regards,<br>" +
//                   "Talacarte</p>" +
//                   "</body>" +
//                   "</html>";
//                 var mailOptions = {
//                   to: req.body.email,
//                   subject: "Verify Your new Email with Travel",
//                   html: emailHTML
//                 };
//                 emailServices.sendMail(mailOptions, () => {});
//               }
//               if (updates && updates["rewards"]) {
//                 updates["rewards"] = Math.round(updates["rewards"]);
//               }
//               delete updates["__v"];
//               delete updates["password"];
//               delete updates["salt"];
//               delete updates["deviceTokens"];
//               res.status(200).send(updates);
//             })
//             .catch(err => {
//               res.status(500).send(err);
//             });
//         })
//         .catch(error => {
//           res.status(500).send(error);
//         });
//     });
//   },