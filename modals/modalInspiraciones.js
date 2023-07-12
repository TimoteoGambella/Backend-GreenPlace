const mongoose = require("mongoose")
const connection= mongoose.connection

const Inspiraciones=mongoose.model("inspirations",{
    title:String,
    type:String,
    photos:Array,
    description:String,
})


module.exports = Inspiraciones
