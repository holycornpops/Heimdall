

module.exports = function(mongoose){
	var TodoSchema = {text:String};

	return mongoose.model('Todo',TodoSchema);
	comsole.log('model executed '); 
}