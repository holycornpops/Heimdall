
module.exports = function(app, mongoose){

    var DataService = require('../models/dataservices')(mongoose);

    app.get('/api/dataservices', function(req, res){
        console.log('/api/dataservices called');
        DataService.find(function(err, ds){
            if(err)
                res.send(err);
            res.jsonp(ds);
        });
    });

    app.post('/api/dataservices/add', function(req, res){
        console.log('/api/dataservices/add called');
        DataService.create({
             _id : req.body._id,
             description : req.body.description,
             servicetype : req.body.servicetype,
             attributename: req.body.attributename,
             servicename: req.body.servicename,
             requestlayout: req.body.requestlayout,
             responselayout: req.body.responselayout,
             done: false},
             function(err, models){
             if(err){
                 console.log("Error in /api/dataservices/add - DataService.create: " + err);
                 res.send(err);
             }else
                 DataService.find(function(err, ds){
                     if(err){
                         res.send(err);
                         console.log("Error in /api/dataservices/add - DataService.find: " + err);
                     }
                     res.jsonp(ds);
             });
        });
    });  
 
    app.get('/api/dataservices/find/:_id', function(req, res){
        console.log('/api/dataservices/find/' + req.params._id + ' called');
        DataService.find({_id: req.params._id},function(err, ds){
            if(err){
                console.log("Error in /api/dataservices/find/ : " + err);
                res.send(err);
            }
            res.jsonp(ds);
        });
    });

    app.post('/api/dataservices/update', function(req, res){
        console.log('/api/dataservices/update called' );
        DataService.update({_id : req.body._id},
            {$set:{
                description : req.body.description,
                servicetype : req.body.servicetype,
               // attributename: req.body.attributename,
                servicename: req.body.servicename,
                requestlayout: req.body.requestlayout,
                responselayout: req.body.responselayout
                }},
            function(err, ds){
            if(err){
                res.send(err);
                    console.log("Error in /api/dataservices/update - DataService.update: " + err);
            }else
                res.jsonp(ds);
        });
        return;
    });             

};