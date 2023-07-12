const mongoose = require("mongoose")
const connection= mongoose.connection

const Plantas=mongoose.model("plants",{
    title:String,
    subtitle:String,
    type:String,
    photos:Array,
    description:String
})

module.exports = Plantas
