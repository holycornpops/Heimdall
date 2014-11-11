//Schema for Resources collection
module.exports = function(mongoose){
	var ResourcesSchema = {
                           _id : String,
                           description: String,
                           product: String,
                           size: Number,
                           type: String
                            };
	return mongoose.model('Resources',ResourcesSchema);
};