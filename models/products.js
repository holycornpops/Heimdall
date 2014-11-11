//Schema for Products collection
module.exports = function(mongoose){
       var ActorRoleSchema= {
                        _id  : String,
                        role : String
        };
	var ProductsSchema = {
                           _id : String,
                           name: String,
                           projectType: {type:String, default:"Non-FCRA"},
                           dataservices: [String],
                           description: String,
                           createdDate :{type : Date, default: Date.now},
                           actors :[ActorRoleSchema],
                           tags:String
                            };
	return mongoose.model('Products',ProductsSchema);
};