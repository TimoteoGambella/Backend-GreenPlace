const mongoose = require("mongoose")
const connection= mongoose.connection

const Plantas=mongoose.model("plants",{
    title:String,
    type:String,
    photos:Array,
    type:String,
})
const Inspiraciones=mongoose.model("inspirations",{
    title:String,
    type:String,
    photos:Array,
    description:String,
})
const Usuarios=mongoose.model("users",{
    mail:String,
    username:String,
    password:String,
    favsPlants:Array,
    favsInspirations:Array
})

module.exports = Plantas
module.exports = Inspiraciones
module.exports = Usuarios