
module.exports = function(app, mongoose, fs, url){

  var Resource = require('../models/resources')(mongoose);

    app.get('/api/resources', function(req, res, next){
             Resource.find(function(err, resources){
                 if(err)
                     res.send(err);
                 res.send(resources);
             });
         });
    
  
     app.post('/api/resource/upload', function(req, res){
      console.log('/api/resource/upload called');
      console.log(req.body);
      console.log('----');
//      console.log(req.files);
      console.log('----');
      console.log('file size: ' +  req.files.file.size);
      console.log('file type: ' +  req.files.file.type);
      console.log('file target: ' +  req.body.target);
      console.log('file description: ' +  req.body.description);
     var tmp_path = req.files.file.path;
     console.log(tmp_path);
     fs.readFile(tmp_path,function(err,data){
         if(err){
             console.log("READ FILE ERROR " + err);
             return;
         }
         console.log("read file from " + tmp_path);
         var contentType = 'image/undefined';
         var fdata = {"data": data,"contentType" : contentType};
         Resource.update({"_id" : req.body.target + '_' + req.files.file.name},
                {$set:{"description" : req.body.description,  "product" : req.body.target, "type":req.files.file.type, "size": req.files.file.size}},{upsert:true},
                function(err, filedata){
                if(err){
                    console.log("RESOURCE UPDATE ERROR " + err);
                    res.send(err);
                    status="FAILED";
                }else{
                    fs.writeFile('app/resource/' +req.body.target +'_'+req.files.file.name, data, function(err){
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
      res.json('Success');
      res.end();
 });   
  
   app.get('/api/resources/remove/:resourceid', function(req, res){
        console.log('/api/resources/remove/' + req.params.resourceid + ' called');     
        Resource.remove({"_id" : req.params.resourceid},function(err,data){
            if(data === 0){
                console.log('ERROR Removing entry from database ' + err);
            }else{
                fs.unlink('app/resource/' + req.params.resourceid, function (err) {
                if (err){
                    console.log("Error in api/resources/remove// - fs.unlink : " + err);
                    res.json('failed');
                }else{
                    console.log('successfully deleted /app/resource/' + req.params.resourceid);
                    res.json('Success');
                }
                });
            };
        });
   });    
    
    app.get('/api/resources/findbyproduct/:productid', function(req, res){
        console.log('/api/resources/findbyproduct/' + req.params.productid + ' called');     
        Resource.find({product : req.params.productid},function(err,resources){
            if(err){
                console.log("Error in /api/resources/findbyproduct/ - Resource.find : " + err);
                res.end();    
            }else{
                res.jsonp(resources);
            };
        });
   
   });        
};