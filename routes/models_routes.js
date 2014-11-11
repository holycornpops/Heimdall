module.exports = function(app, mongoose){

    var Models = require('../models/models')(mongoose);

    app.get('/api/models', function(req, res){
        Models.find(function(err, models){
            if(err){
                console.log("Error in /api/models - Models.find : " + err);
                res.send(err);
            }
            res.jsonp(models);
        });
    });

    app.get('/api/models/findbyproduct/:productId', function(req, res){
        console.log('Calling /api/models/findbyproduct/' + req.params.productId)
        Models.find({product : req.params.productId},function(err, models){
            if(err){
                console.log("Error in /api/models/findbyproduct/ - Models.find : " + err);
                res.send(err);
            }
            res.jsonp(models);
        });
    });

   app.post('/api/models/add', function(req, res){
       console.log('/api/models/add called');
        Models.create({
            _id : req.body._id,
            description : req.body.description,
            type : req.body.type,
            classification : req.body.classification,
            product : req.body.product,
            done: false},
            function(err, models){
            if(err){
                console.log("Error in /api/models/add - Models.create : " + err);
                res.send(err);
            }else
                Models.find(function(err, models){
                    if(err){
                        console.log("Error in /api/models/add - Models.find : " + err);
                        res.send(err);
                    }
                    res.jsonp(models);
            });
     });
 });  

 
app.get('/api/models/find/:model_id', function(req, res){
    console.log('/api/models/find/' + req.params.model_id + ' called' );
    Models.find({_id: req.params.model_id},function(err, models){
        if(err){
            console.log("Error in api/models/update - Models.find : " + err);
            res.send(err);
        }
        res.jsonp(models);
    });
});

app.post('/api/models/update', function(req, res){
    console.log('api/models/update called' );
    Models.update({_id : req.body._id},
        {$set:{
            description : req.body.description,
            description : req.body.description,
            type : req.body.type,
            classification : req.body.classification,
            product : req.body.product
            }},
        function(err, models){
        if(err){
            console.log("Error in api/models/update - Models.update : " + err);
            res.send(err);
        }else
            res.jsonp(models);
    });
    return;
 });             
 

};