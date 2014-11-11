//Schema for Activities collection
module.exports = function(mongoose){
        var CommentSchema= {
                        _id  : Number,
                        body : String,
                        createdDate : {type : Date, default: Date.now}
        };
        var CommentModel= mongoose.model('Comments', CommentSchema);
	var JournalsSchema = {
                           _id : Number,
                           title: String,
                           body : String,
                           comments: [CommentSchema],
                           createdDate :{type : Date, default: Date.now}
                            };
	return mongoose.model('Journals',JournalsSchema);
};