//Schema for Sequence collection

module.exports = function(mongoose){
	var SequencesSchema = {
                           _id: String,
                           seq: Number
                            };
	return mongoose.model('Sequences',SequencesSchema);
};

