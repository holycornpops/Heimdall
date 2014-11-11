
module.exports = function(app, mongoose, fs, url){


    var Users = require('../models/users')(mongoose);


    app.get('/api/users', function(req, res, next){
        //var userModel = new Users;
        Users.find(function(err, users){
            if(err)
                res.send(err);
            res.send(users);
        });
    });
    
    //-- Get user Avatars
    /*
    app.get('/api/users/avatar/:_id', function(req, res, next){
        console.log("/api/users/avatar called for " + req.params._id);
        var id = {_id:req.params._id};
        Users.findById(id,function(err, users){
            //console.log(users);
            if(err)
                res.send(err);
           if(users != null && users.img.data != undefined){
                console.log("Sending avatar back for " + req.params._id);  
                res.contentType(users.img.contentType);
                res.send(users.img.data);
                res.end("ok");    
            }
            res.end("ok");    

        });
        
    });*/
    
    //-- Get user Info
    app.get('/api/users/find/:_id', function(req, res, next){
        console.log("/api/users/find/:_id called for " + req.params._id);
        var id = {_id:req.params._id};
        Users.findById(id,function(err, users){
            console.log(users);
            if(err){
                console.log("Error finding user " + err);
                res.send(err);
            }
           //if(users != null && users.img.data != undefined){
           if(users != null ){
               console.log("returning " + users);
                res.jsonp(users);
                res.end("ok");    
            }
            res.end("ok");    

        });
        
    });
    
    //-- Add a User
    app.post('/api/users/add', function(req, res){
        console.log('API/USERS/add called' );
        console.log(req.body);
        Users.create({
            _id : req.body._id,
            name : req.body.name,
            email : req.body.email,
            createdBy : req.body.createdBy,
            done: false},
            function(err, users){
                console.log("INSERT ERROR " + err);
            if(err)
                res.send(err);
            else
                Users.find(function(err, users){
                    if(err)
                        res.send(err);
                    res.jsonp(users);
                });
        });
        return;
     });
     
    //-- Update a User record
    app.post('/api/users/update', function(req, res){
        console.log('API/USERS/update called' );
        console.log(req.body);
        Users.update({_id : req.body._id},
            {$set:{name : req.body.name,
                email : req.body.email
                }},
            function(err, users){
            if(err){
                res.send(err);
                console.log("USERS UPDATE ERROR " + err);
            }else
                res.jsonp(users);
        });
        return;
     });


    app.post('/api/users/upload', function(req, res){
     console.log('API/USERS/UPLOAD POST called' );
     
     console.log(req.body);
     console.log(req.files);
     var tmp_path = req.files.file.path;
     console.log(tmp_path);
     console.log(req.body.flowFilename);
     var imagename = req.body.flowFilename + '.' + req.body.flowRelativePath.split('.').pop();
     console.log("extension=" + req.body.flowRelativePath.split('.').pop());
     console.log("====================");
     var status="SUCCESS";
     fs.readFile(tmp_path,function(err,data){
         if(err){
             console.log("READ FILE ERROR " + err);
             return;
         }
         console.log("read file from " + tmp_path);
         var imgContentType = 'image/undefined';
         var img = {"data": data,"contentType" : imgContentType};
         console.log("IMG IS " + img);
         Users.update({"_id" : req.body.flowFilename},
                {$set:{"img" : img,  "imagename" : imagename}},
                function(err, users){
                if(err){
                    console.log("USERS UPDATE ERROR " + err);
                    res.send(err);
                    status="FAILED";
                }else{
                    //copy image to img/actors folder
                    fs.writeFile('app/img/users/'+imagename, data, function(err){
                        if(err){
                            console.log('ERROR writing file ' + err);
                        }else{
                            fs.unlink(tmp_path, function(err) {
                                if (err) console.log('ERROR Removing temp file ' + tmp_path );
                                console.log('temp file ' + tmp_path +' removed');
                            });
                            
                        };
                    });
                }
         });   
     });

     res.send(status);
     res.end();
    });
        
   
};