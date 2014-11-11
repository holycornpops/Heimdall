module.exports = function(app, mongoose, Activities){

    var Products = require('../models/products')(mongoose);

    app.post('/api/products/add', function(req, res){
        console.log('/api/products/add called');
        Products.create({
            _id : req.body._id,
            name : req.body.name,
            description : req.body.description,
            productType : req.body.productType,
            actors : req.body.actors,
            tags : req.body.tags,
            done: false},
            function(err, products){
            if(err){
                console.log("Error in /api/products/add - Products.create : " + err);
                res.send(err);
            }
            else
                Products.find(function(err, products){
                    if(err){
                        console.log("Error in /api/products/add - Products.find : " + err);
                        res.send(err);
                    }
                    res.jsonp(products);
            });
        });
    });  


    app.get('/api/products/activitycounts/:product_id', function(req, res){
        console.log("/api/products/activitycounts/" + product_id + " Called");
        Activities.aggregate(
           { $group: {_id: {product:"$product",type:"$type"}, total:{$sum:1}}},
           { $match:{"_id.product":req.params.product_id}},      
          function(err, summary){
            if(err){
                console.log("Error in /api/products/activitycounts/ - Activities.aggregate : " + err);
                res.send(err);
            }
            res.jsonp(summary);
        });
    });


    
    app.get('/api/products', function(req, res){
        console.log('/api/Products called' );
        Products.find(function(err, products){
            if(err){
                console.log("Error in /api/Products - Products.find : " + err);
                res.send(err);
            }
            res.jsonp(products);
        });
    });

    
    app.get('/api/products/find/:product_id', function(req, res){
        console.log('/api/Products/find/' + req.params.product_id + ' called' );
        Products.find({_id: req.params.product_id},function(err, products){
            if(err){
                console.log("Error in /api/Products/find/ - Products.find : " + err);
                res.send(err);
            }
            res.jsonp(products);
        });
    });

    app.post('/api/products/update', function(req, res){
        console.log('/api/Products/update called' );
        Products.update({_id : req.body._id},
            {$set:{name : req.body.name,
                description : req.body.description,
                projectType : req.body.projectType,
                tags: req.body.tags
                }},
            function(err, products){
            if(err){
                console.log("Error in /api/Products/update - Products.update : " + err);
                res.send(err);
            }else
                res.jsonp(products);
        });
        return;
     });             
 
 
    app.post('/api/products/updateactors', function(req, res){
        console.log('api/Products/updateactors called' );
        console.log(req.body);
        Products.update({_id : req.body._id},
            {$set:{actors : req.body.actors
                }},
            function(err, products){
            if(err){
                console.log("Error in api/Products/updateactors - Products.update : " + err);
                res.send(err);
            }else
                res.jsonp(products);
        });
        return;
     });   
 
     app.post('/api/products/updateservices', function(req, res){
        console.log('api/Products/updateservices called' );
        Products.update({_id : req.body._id},
            {$set:{dataservices : req.body.dataservices
                }},
            function(err, products){
            if(err){
                res.send(err);
                console.log("Error in /api/products/updateservices - Products.update : " + err);
            }else
                res.jsonp(products);
        });
        return;
     });   
 
    app.delete('/api/products/remove/:product_id', function(req, res) {
        console.log('/api/products/remove/' + req.params.product_id + ' called' );
        Products.remove({_id : req.params.product_id}, 
            function(err, products) {
                if (err)
                    console.log("Error in /api/products/remove/ - Products.remove : " + err);
                Products.find(function(err, products){
                        if (err){
                           console.log("Error in /api/products/remove/ - Products.find : " + err);
                           res.send(err);
                        }
                        res.json(products);
            });
        });
    });
};