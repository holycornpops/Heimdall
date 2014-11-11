//Schema for Activities collection
module.exports = function(mongoose){
	var ActivitiesSchema = {
                           _id : Number,
                           activityName: String,
                           product: String,
                           type: String,
                           createDate: {type: Date, default :Date.now},
                           targetDate: {type: Date},
                           status :{type: String, default: "NEW"},
                           createdBy: String,
                           assignedTo: {type:String, default:"Nobody"},
                           details : [  {_id :Number, detail:String, createdDate:{type:Date, default: Date.now}, createdBy: String}]
                            };
	return mongoose.model('Activities',ActivitiesSchema);
};