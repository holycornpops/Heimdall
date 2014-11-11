//Schema for Models collection
module.exports = function(mongoose){
	var ModelsSchema = {
                           _id : String,
                           description: String,
                           classification: {type:String, default:"Non-FCRA"},
                           type: {type:String, default:"Scoring"},
                           createdDate :{type : Date, default: Date.now},
                           product : String    
                            };
	return mongoose.model('Models',ModelsSchema);
};