//Schema for DataServices  collection
module.exports = function(mongoose){
	var DataServicesSchema = {
                           _id : String,
                           description: String,
                           servicetype: {type:String, default:"Attribute"},
                           attributename: String,
                           servicename : String,
                           requestlayout : String,    
                           responselayout : String,    
                            };
	return mongoose.model('DataService',DataServicesSchema);
};