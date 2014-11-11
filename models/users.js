//Schema for Users collection
module.exports = function(mongoose){
	var UsersSchema = {
                           _id : String,
                           name: String,
                           email: String,
                           img : {data:Buffer, contentType: String},
                           imagename: {type: String, default:"noimage.jpg"},
                           createDate: {type: Date, default :Date.now}
                            };
	return mongoose.model('Users',UsersSchema);
};