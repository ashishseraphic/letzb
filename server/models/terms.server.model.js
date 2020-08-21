
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const termsSchema = new Schema({
    termsHtml: {
        type: String
    },
    version: {
        type: Number,
        default: 1
    },
    webUrl: {
        type: String
    }

}, { timestamps: true });

let term = Mongoose.model('termsAndCondition', termsSchema);

// term
//     .update({

//     }, {

//         $set: {
//             termsHtml: `<!doctype html>
//             <html lang="en">
            
//             <head>
//               <meta charset="utf-8">
//               <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
//               <title>LETZB Terms And Conditions</title>
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
               
//                     height: 200px;      
//                     background-color:#f1e4f5;
//               }
             
//           </style> 
            
//             </head>
            
//             <body>
//               <div id = "color" class = "my_text">
//                 <div id= "color">
//                 <p>Click <a href="">here</a> to download a PDF<br><br>
//                 Last revised on 04/07/2020</p>
//                 <p>Payment</p>
//                 <p>
//                 All payments are due on receipt if a payment is not received or payment method is declined, the buyer forefits the ownership of any items purchsed. If no payment is revised, no item will be shipped.
//                     </p>

//                 </div>
//             </body>
            
//             </html>`
//             , webUrl: "http://ec2-3-21-237-151.us-east-2.compute.amazonaws.com:5000/privacy"
//         },
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
//         console.log('err', err)
//     })
module.exports = term