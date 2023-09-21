const mongoose = require("mongoose");

const { Schema } = mongoose;
const matchSchema = new Schema(
    {
        status:{type:String},
        start_at:{type:String},
        tournament_id:{type:String},
        teams:{type:JSON,required: [true, 'Please Provide a teams']},
        players:{type:JSON,required: [true, 'Please Provide a players']},
        match_key:{type:String},
        squad:{type:JSON},
        toss:{type:JSON,default:{}},
        play:{type:JSON,default:{}},
        name:{type:String},
        venue: {type:Object},
        sub_title:{type:String},
        format:{type:String},
        title : {type:String},
        winner : {type:String},
        squad_a_captain :{type:String},
        squad_b_captain :{type:String},
        squad_a_keeper :{type:String},
        squad_b_keeper :{type:String},
    },
  { timestamps: true }
);


const matchs = mongoose.model("matchdetails", matchSchema);
module.exports = matchs;