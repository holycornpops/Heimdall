
module.exports = function(app, mongoose, io, xml, Activities){

    var Sequences = require('../models/sequences')(mongoose);

    /*
    function getNextSequence(name) {
        var query = {"_id" : name};
        var update ={$inc: {seq:1}};
        var options = {new:false};
        var seq = 0;
        Sequences.findOneAndUpdate(query, update, options,function(err, sequences){
               seq = sequences.seq;
        });
        console.log("Returning next sequence for activities: " + seq)
        return seq;
    }*/
    
    app.get('/api/activities', function(req, res){
        console.log("/api/activities called" );
        Activities.find().sort('Details.createdDate').exec(
        function(err, activities){
            if(err)
                res.send(err);
            res.jsonp(activities);
        });
    });

   app.get('/api/activities/lastfive', function(req, res){
        console.log("/api/activities/lastfive called" );
        Activities.find().sort('Details.createdDate').limit(5).exec(
        function(err, activities){
            if(err)
                res.send(err);
            res.jsonp(activities);
        });
    });

    app.get('/api/activities/findlastfive/:productId', function(req, res){
        console.log("/api/activities/findlastfive/" + req.params.productId + " called" );
        Activities.find({product: req.params.productId }).sort('Details.createdDate').limit(5).exec(
        function(err, activities){
            if(err)
                res.send(err);
            res.jsonp(activities);
        });
    });

    app.get('/api/activities/counts', function(req, res){
        console.log("/api/activities/counts Called");
        Activities.aggregate(
           { $group: {_id: "$type", type:{$sum:1}}},      
          function(err, summary){
            if(err)
                res.send(err);
            res.jsonp(summary);
        });
    });

    app.get('/api/activities/status/counts', function(req, res){
        console.log("/api/activities/status/counts Called");
        Activities.aggregate(
           { $group: {_id: "$status", status:{$sum:1}}},      
          function(err, summary){
            if(err)
                res.send(err);
            console.log(summary);
            res.jsonp(summary);
        });
    });

    app.get('/api/activities/find/:activity_id', function(req, res){
        console.log("/api/activities/find/"+ req.params.activity_id + " called");
        Activities.find({_id: req.params.activity_id},function(err, activities){
            if(err)
                    res.send(err);
            res.jsonp(activities);
        });
    });

    app.post('/api/activities/add', function(req, res){
        console.log("/api/activities/add called");
        
        var query = {"_id" : "activities"};
        var update ={$inc: {seq:1}};
        var options = {new:false};
        var seq = 0;
        Sequences.findOneAndUpdate(query, update, options,function(err, sequences){
            if(err){
                console.log("Error in /api/activities/add - Sequences.findOneAndUpdate activities: " + err);
                res.send(err);
            }
            else{
                Sequences.findOneAndUpdate({"_id" : "detail"}, {$inc: {seq:1}},{new:false},function(err, detailsequences){
                    if(err){
                        console.log("Error in /api/activities/add - Sequences.findOneAndUpdate detail: " + err);
                        res.send(err);
                    }else{

                        Activities.create({
                            _id : sequences.seq,
                            activityName : req.body.activityName,
                            product : req.body.product,
                            type : req.body.type,
                            details : [{_id:detailsequences.seq, detail:req.body.detail,createdBy:req.body.createdBy}],
                            createdBy : req.body.createdBy,
                            targetDate: req.body.targetDate,
                            done: false},
                            function(err, activities){
                                console.log("Error in /api/activities/add - Activities.create : " + err);
                            if(err)
                                res.send(err);
                            else
                                Activities.find(function(err, activities){
                                    if(err){
                                        res.send(err);
                                        console.log("Error in /api/activities/add - Activities.find : " + err);
                                    }
                                    res.jsonp(activities);
                                });
                        });
                    }  
                });
            };
            return;
        });
    });

    app.post('/api/activities/addactivitydetail', function(req, res ){
        console.log("/api/activities/addactivitydetail called " + req.body.assignedTo);
        var query = {"_id" : "detail"};
        var update ={$inc: {seq:1}};
        var options = {new:false};
        var seq = 0;
        Sequences.findOneAndUpdate(query, update, options,function(err, sequences){
            if(err){
                console.log("Error in /api/activities/addactivitydetail - Sequences.findOneAndUpdate detail: " + err);
                res.send(err);
            }
            else{        
        
            var newMessage= {_id:sequences.seq, detail: req.body.newDetail, createdBy:req.body.createdBy, createdDate: new Date()};
            Activities.update({
                _id : req.body._id
            },{
              $push: {details: newMessage},
              $set :{assignedTo: req.body.assignedTo}
            },
            {done: false},
            function(err, activities){
                if(err){
                    console.log("Error in /api/activities/addactivitydetail - Activities.update: " + err);
                    res.send(err);
                }else
                    console.log('Broadcasting new_activity'); 
                    io.sockets.emit('new_activity',{detail: newMessage, _id: req.body._id}) ;
                    res.jsonp(activities);
            });
        }
        return;
        });
     });     
     
    app.post('/api/activities/updateactivity', function(req, res ){
        console.log("/api/activities/updateactivity called");
        Activities.update({
            _id : req.body._id
        },{
          $set: {product: req.body.product,
                 type: req.body.type,
                 status: req.body.status,
                 targetDate: req.body.targetDate,
                 assignedTo: req.body.assignedTo}
        },
        {done: false},
        function(err, activities){
            if(err){
                console.log("Error in /api/activities/updateactivity - Activities.update: " + err);
                res.send(err);
            }else
                res.send("complete");
        });
        return;
    });  

    app.delete('/api/activities/remove/:activity_id', function(req, res) {
        console.log("/api/activities/remove/" + req.params.activity_id + " called");
        Activities.remove({_id : req.params.activity_id}, 
            function(err, activities) {
                if (err){
                        console.log("Error in /api/activities/remove - Activities.remove: " + err);
                        res.send(err);
                    }        
                // get and return all the activities after you create another
                Activities.find(function(err, activities){
                        if (err)
                            console.log("Error in /api/activities/remove - Activities.find: " + err);;
                        res.json(activities);
            });
        });
    });
    
    app.post('/api/activities/updateactivitydetail', function(req, res ){
        console.log("/api/activities/updateactivitydetail called ");

        var newMessage= {_id: req.body.id, detail: req.body.detail, createdBy:req.body.createdBy};
        Activities.update({
            'details._id' : req.body._id
        },{
          $set: {'details.$.detail': req.body.detail}
        },
        {done: false},
        function(err, details){
            if(err){
                console.log("Error in /api/activities/updateactivitydetail - Activities.update: " + err);
                res.send(err);
            }else
                console.log('Broadcasting updated activity'); 
                io.sockets.emit('update_activity_detail',{detail: newMessage, _id: req.body._id}) ;
                res.jsonp(details);
        });
        return;
     });    
    
};
