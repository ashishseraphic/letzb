'use strict';
let
    models = require('../models'),

    _ = require('lodash'),
    errorHandler = require('./errors.server.controller');



var categories = {
   
    async addCategory(req, response)
    {
       try{
        let body = req.body
       
            let  categoryName = body.categoryName
        if(!categoryName)
        {
             
         response.status(400).send({
            success:false,
            message:"Category Name is required."   
        })

        }
        else
        {
         let category = await models.category.create(body)
         
         response.status(200).send({
             success:true,
             message:"Category Added"   
         })

       }
    }
       catch(error){
           response.status(500).send({
               success:false,
               message:errorHandler.getErrorMessage(error)
           })

       }
        
    },

    async editCategory(req, response)
    {
       try{
        let body = req.body
        let id = req.params.id
            let  categoryName = body.categoryName
        if(!categoryName)
        {
             
         response.status(400).send({
            success:false,
            message:"Category Name is required."   
        })

        }
        else
        {
         let category = await models.category.findOneAndUpdate({_id:id},{$set:{categoryName:categoryName}},{new:true})
         
         response.status(200).send({
             success:true,
             message:"Category Added"   
         })

       }
    }
       catch(error){
           response.status(500).send({
               success:false,
               message:errorHandler.getErrorMessage(error)
           })

       }
        
    },

    async getCategories(req, response)
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
                        categoryId: "$_id",
                        categoryName:1
                    }
            }
            ]
            let category = await models.category.aggregate(aggregate)
            
            response.status(200).send({
                success:true,
                message:"Categories",
                data:{
                  categories:category || {}
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

    async deleteCategory(req, response)
    {
        try
        {
            let id = req.params.id
            let deleteCategory = await models.category.findOneAndUpdate({_id:id},{$set:{isDeleted:true}},{new: true})
            if(!deleteCategory)
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
					message: "Category Deleted Successfully"
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

    async getCategory(req, response)
    {
        try
        {
           let id = req.params.id
           let found = await models.category.findOne({_id:id})

           response.status(200).send({
            success: true,
            message: "Category",
            data:{
                category: found
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

module.exports = categories;

