
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const privacyPolicySchema = new Schema({
    privacyPolicyHtml: {
        type: String
    },
    // version: {
    //     type: Number,
    //     default: 1
    // },
    webUrl:{
        type: String
        }
    
},{ timestamps: true });

let privacyPolicyModel = Mongoose.model('privacyPolicy', privacyPolicySchema);


privacyPolicyModel
    .update({

    }, {

        $set: {
            privacyPolicyHtml: `<!doctype html>
            <html lang="en">
            
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <title>LetzBE Privacy and Policy</title>
              <style> 
              #color{
                color:white;
              }
              
              .Center { 
                  width:200px; 
                  height:200px; 
                  position: fixed; 
                  bottom: 70%; 
                  left: 50%; 
                  margin-left: -100px;
                
              } 
              .my_text
              {
                  font-family:    Museo sans, rounded;
                  font-size:      15px;
            
              }
              body {
               
                    height: 200px;      
                    background-image: linear-gradient(-90deg, #4A96D4,#6EDACC); /* Standard syntax (must be last) */
                               
              }
             
          </style> 
            
            </head>
            
            <body>
          
              <div id = "color" class = "my_text" >
                <div id= "color">
                <b>Privacy Policy</b><br>
                Applicable To The Following Mobile Application:<br>
                            <center>LetzBE</center>
                </div>
                
              </div>
            </body>
            
            </html>`
        , webUrl:"http://localhost:3000/privacy"},
        // $inc: {
        //     version: 1
        // }
    }, {
        upsert: true
    })
    .then((result) => {
        // console.log('result', result);
    })
    .catch((err) => {
        // console.log('err', err)
    })
module.exports = privacyPolicyModel