'use strict';
let
    models = require('../models'),

    _ = require('lodash'),
    errorHandler = require('./errors.server.controller');
const bodyParser = require('body-parser');



var locations = {
   
    async addLocation(req, response)
    {
       try{
           let body = req.body
        let locationName = body.locationName

        if(!locationName)
        {             
         response.status(400).send({
            success:false,
            message:"Location is required."   
        })
    }
        else
        {
         let location = await models.eventlocation.create(body)
         response.status(200).send({
             success:true,
             message:"Location Added"   
         })
       }}
       
       catch(error)
       {
        response.status(400).send({
            success: false,
            message: errorHandler.getErrorMessage(error)
        })
       }
    },

    async getLocations(req, response)
    {
        try
        {
            let aggregate = [
                {
                    "$match":{isDeleted:false}
                },
                {
                $project:{
                    _id:0,
                    locationId: "$_id",
                    locationName:1
                }
            }
            ]
            
            let locations = await models.eventlocation.aggregate(aggregate)
            
            response.status(200).send({
                success:true,
                message:"Locations",
                data:{
                    locations:locations || {}
                      }
            })
        }
        catch(error)
        {
            response.status(400).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }

    },
    async editLocation(req, response)
    {
       try{
           let body = req.body
           let id = req.params.id
        let locationName = body.locationName

        if(!locationName)
        {             
         response.status(400).send({
            success:false,
            message:"Location is required."   
        })
    }
        else
        {
         let location = await models.eventlocation.findOneAndUpdate({_id:id},{$set:{locationName:locationName}})
         response.status(200).send({
             success:true,
             message:"Location Edited"   
         })
       }}
       
       catch(error)
       {
        response.status(400).send({
            success: false,
            message: errorHandler.getErrorMessage(error),s   
        })
       }
    },

    async deleteLocation(req, response)
    {
        try
        {
            let id = req.params.id
            let deleteLocation = await models.eventlocation.findOneAndUpdate({_id:id},{$set:{isDeleted:true}},{new: true})
            if(!deleteLocation)
            {
                response.status(400).send({
					success: false,
					message: "Something Went Wrong"
				});
            }
            else
            {
                response.status(200).send({
					success: true,
					message: "Location Deleted Successfully"
				});
            }
        }
        catch(error)
        {
            response.status(500).send({
                success: false,
                message: errorHandler.getErrorMessage(error)
            });

        }
    },
    
    async getLocation(req, response)
    {
        try
        {
           let id = req.params.id
           let found = await models.eventlocation.findOne({_id:id})

           response.status(200).send({
            success: true,
            message: "Category",
            data:{
                location: found
            }
           
        })
           
        }
        catch(error)
        {
            response.status(400).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
               
            })
        }

    },

    
    
};

module.exports = locations;
