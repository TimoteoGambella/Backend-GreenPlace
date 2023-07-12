const mongoose = require("mongoose")
const connection= mongoose.connection

const Usuarios=mongoose.model("users",{
    mail:String,
    username:String,
    password:String,
    favsPlants:Array,
    favsInspirations:Array
})

module.exports = Usuarios