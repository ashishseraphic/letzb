// var cron = require('node-cron'),
//     DB = require('../models');
 
//     // */5 * * * *
//     // cron.schedule("02 13 * * *", function(){
//         cron.schedule('59 23 * * *', function(){
//   // console.log('cron runs on 1 day on every month ');
//   DB.users.find({},(req, res)=>{
//     let now = new Date().getDate();
//     let arr = []
//     let ids = []
//     for (let index = 0; index < res.length; index++) {
//         if(now - res[index].lastPlayed >=2 || now - res[index].lastPlayed >=-30)
//         {
//             arr.push(res[index]);
//         }
//     }
//    for (let index = 0; index < arr.length; index++) {
//        ids.push(arr[index].id)   
//    }

// let newfiltr= []
// for (let index = 0; index < ids.length; index++) {
//     newfiltr.push({
//         updateOne: {
//             "filter": {
//                 "_id": res[index]
//             },
//             "update": {
//                 "$set": {
//                     currentStreak: 0
//                 }
//             },
//             "upsert": false
//         }
//     })
// }
// // console.log("filter", newfiltr)
// DB.users.bulkWrite(newfiltr).then((result) => {
//            console.log('Result: ', result);
//         })
//         .catch((err) => {
//           console.log('Error: ', err);
//         })
// })
      
// //   DB
// //     .UserSchema
// //     .update({

// //     }, {
// //       $set: {
// //         monthBalance : 0
// //       }
// //     }, {
// //       multi: true
// //     })
// //     .then((result) => {
// //        console.log('Success: unset all users monthly balance');
// //        console.log('Result: ', result);
// //     })
// //     .catch((err) => {
// //       console.log('[Cron Job: unset all users monthly balance]');
// //       console.log('Error: ', err);
// //     })

// });