
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const Privacy = new Schema({
    privacyPolicyHtml: {
        type: String
    },
    version: {
        type: Number,
        default: 1
    },
    webUrl:{
        type: String
        }
    
},{ timestamps: true });

let privacyPolicyModel = Mongoose.model('privacypolicy', Privacy);

// privacyPolicyModel
//     .update({

//     }, {

//         $set: {
//             privacyPolicyHtml: `<!doctype html>
//             <html lang="en">
            
//             <head>
//               <meta charset="utf-8">
//               <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
//               <title>LETZB Privacy and Policy</title>
//               <style> 
//               #color{
//                 color:black;
//               }
              
//               .Center { 
//                   width:200px; 
//                   height:200px; 
//                   position: fixed; 
//                   bottom: 70%; 
//                   left: 50%; 
//                   margin-left: -100px;
                
//               } 
//               .my_text
//               {
//                   font-family:    Museo sans, rounded;
//                   font-size:      15px;
            
//               }
//               body {
               
//                 height: 200px;      
//                 background-color:#f1e4f5;
//           }       
             
             
//           </style> 
            
//             </head>
            
//             <body>
          
//               <div id = "color" class = "my_text" >
//                 <div id= "color">
//                 <p>Click <a href="myw3schoolsimage.pdf" download>here</a> to download a PDF<br><br>
//                 Effective on 04/07/2020</p>
//                 <p>How We Collect and Use Information<br>
//                 We collect the following types of information about you:<br>
//                 Information you provide us directly:<br><br>
             
//                 We ask for certian information such as you username, real name, birthdate, address, phone number and e-mail address
//                 </p>
              
//               </div>
//             </body>
            
//             </html>`
//         , webUrl:"http://ec2-3-21-237-151.us-east-2.compute.amazonaws.com:5000/privacy"},
//         // $inc: {
//         //     version: 1
//         // }
//     }, {
//         upsert: true
//     })
//     .then((result) => {
//         // console.log('result', result);
//     })
//     .catch((err) => {
//         // console.log('err', err)
//     })
module.exports = privacyPolicyModel