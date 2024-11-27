const mongoose= require ("mongoose");
const Schema=mongoose.Schema;

const travelStorySchema= new Schema({
    title:{type:String, required:true},
    story:{type:String, required: true},
    visitedLocation:{type: [String], default:[]},
    isFavourite:{type: Boolean, default:false},
    userId:{type:Schema.Types.ObjectId, ref:'User', required: true},
    createOn:{type:Date, default:Date.now},
    imageUrl:{type:String, required : true},
    visitedDate:{type:Date, required :true},
    likedBy: { type: [String], default: [] },
    dislikedBy: { type: [String], default: []},

});

module.exports=mongoose.model("TravelStory",travelStorySchema);