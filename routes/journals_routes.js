
module.exports = function(app, mongoose,url){

    var Journals = require('../models/journals')(mongoose);
    var JournalSequences = mongoose.model('Sequences')
    app.get('/api/journals', function(req, res, next){
        console.log("/api/journals called ");
        Journals.find({}).sort({createdDate:-1}).exec(function(err, journals){
            if(err){
                console.log("Error in /api/journals - Journals.find: " + err);
                res.send(err);
            }
            res.send(journals);
        });
    });
    
    app.get('/api/journals/lastfive', function(req, res){
        console.log("/api/journals/lastfive called ");
        Journals.find().sort({createdDate:-1}).limit(5).exec(
        function(err, journals){
            if(err){
                console.log("Error in /api/journals/lastfive - Journals.find: " + err);
                res.send(err);
            }
            res.jsonp(journals);
        });
    });
    
    app.get('/api/journals/find/:journal_id', function(req, res){
        console.log("/api/journals/find/"+ req.params.journal_id + " called");
        Journals.find({_id: req.params.journal_id},function(err, journals){
            if(err){
                console.log("Error in /api/journals/find/:journal_id - Journals.find: " + err);
                res.send(err);
            }
            res.jsonp(journals);
        });
    });
    
    app.post('/api/journals/add', function(req, res){
        console.log("/api/journals/add called");

        var query = {"_id" : "journals"};
        var update ={$inc: {seq:1}};
        var options = {new:false};
        var seq = 0;


        JournalSequences.findOneAndUpdate({"_id" : "journals"}, {$inc: {seq:1}},{new:false},function(err, sequences){
            if(err){
                console.log("Error in /api/journals/add - JournalSequences.findOneAndUpdate: " + err);
                res.send(err);
            }else{
                Journals.create({
                    _id : sequences.seq,
                    title : req.body.title,
                    body : req.body.htmlcontent,
                    done: false},
                    function(err, journal){
                    if(err){
                        console.log("Error in /api/journals/add - Journals.create : " + err);
                        res.send(err);
                    }
                    else
                        Journals.find(function(err, journal){
                            if(err){
                                res.send(err);
                                console.log("Error in /api/journals/add - Journals.find : " + err);
                            }
                            res.jsonp(journal);
                        });
                });
            }  
        });
     return; 
    });
};