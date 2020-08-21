var express = require('express');
var app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
	cors = require('cors'),
	https = require("https"),
    config = require('./server/config.server'),
    nunjucks = require('nunjucks'),
    multer = require('multer')
    // fs = require('fs'),
    // Storage = multer.diskStorage({
	// 	destination: function (req, file, callback) {
          
    //         callback(null, path.join(process.env.PWD, 'uploads'));
           
    //     },
      
	// 	filename: function (req, file, callback) {
    //         // console.log("File", file)
	// 		callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	// 	}
	// }),
	// upload = multer({
	// 	storage: Storage
    // }),
    // dir = path.join(process.env.PWD, 'server/uploads')
          
console.log("url",config.serverUrl);


require('./server/models');
app.set('views', path.join(__dirname, 'server/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const routes = require('./server/routes');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

app.use(cookieParser());
app.use(express.static(__dirname + '/public'))
app.use(express.static(path.join(process.env.PWD, 'public')));

app.use(express.static(__dirname + '/uploads'));

// Allow CORS
app.use(cors({
    'origin': "*",
    'exposedHeaders': ['X-Requested-With', 'content-type', 'Authorization'],
    'credentials': true
}))

nunjucks.configure('server/views', {
    autoescape: true,
    express: app
});

const fixtures = require('./server/fixtures');
const router = require('./server/routes/promotion.server.routes');
fixtures.userFixture.fixtureUser();

app.use('/', routes.users);
app.use('/', routes.questions);
app.use('/', routes.swipe);
app.use('/', routes.profiles);
app.use('/', routes.categories);
app.use('/', routes.eventlocation);
app.use('/', routes.events);
app.use('/', routes.admin);
app.use('/', routes.privacy);
app.use('/', routes.promotion)
app.use('/', routes.feedback)
app.use('/', routes.subscription)

// const  {admin} = require('./service/pushnotification')

// app.post('/firebase/notification', (req, res)=>{
//     const  registrationToken = req.body.registrationToken
//     var payload = {
//         notification: {
//           title: "This is a Notification",
//           body: "This is the body of the notification message."
//         }
//       };

//        var options = {
//         priority: "high",
//         timeToLive: 60 * 60 *24
//       };
      
//       admin.messaging().sendToDevice(registrationToken, payload, options)
//         .then(function(response) {
//             console.log(response.results[0].error);
//           console.log("Successfully sent message:", response);
//         })
//         .catch(function(error) {
//           console.log("Error sending message:", error);
//         });
// })

app.get('/', function (err, res) {
    res.send("Hello There")
})

app.listen(5000, () => {
    console.log("server started on 5000");
})
