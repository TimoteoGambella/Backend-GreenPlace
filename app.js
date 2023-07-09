const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")

require("dotenv").config()

const password=process.env.PASSWORDMONGO // FALTA PASSWORD => CONTACTARSE CONMIGO PARA RECIBIRLA
const dbname="GreenPlaceData"

const uri = `mongodb+srv://timoteogambella:${password}@cluster0.7hkmrxo.mongodb.net/${dbname}?retryWrites=true&w=majority`

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))
app.use(cors())

const CryptoJS = require('crypto-js');

mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})

const connection= mongoose.connection

connection.once("open", ()=>{
    console.log("Conexion a la BD exitosa...")
})
connection.on("error", (error,res)=>{
    console.log("Error en la conexion a la BD:",error)
})

const Usuarios = require("./modals/modals")
const Inspiraciones = require("./modals/modals")
const Plantas = require("./modals/modals")


app.post("/api/getTypes",(req,res)=>{
    const typesOfInspirations = require("./modals/types")
    const typesOfPlants = require("./modals/types")

    if(req.body.type!=="inspirations" && req.body.type!=="plants"){
        res.json({response:"failed",data:[],message:"Parametro incorrecto"})
    }else{
        res.json({response:"success",data:req.body.type==="inspirations"?typesOfInspirations:typesOfPlants,message:"Tipos encontrados"})
    }
})
app.post("/api/getPlantsByType",(req,res)=>{
    Plantas.find({type:req.body.type}).then(doc=>{
        res.json({response:"success",data:doc,message:"Todas las plantas"})
    })
    .catch(err=>{
        res.json({response:"failed",data:doc,message:"Error Base de Datos"})
    })
})
app.post("/api/getAllInspirations",(req,res)=>{
    Inspiraciones.find({}).then(doc=>{
        res.json({response:"success",data:doc,message:"Todas las inspiraciones"})
    })
    .catch(err=>{
        res.json({response:"failed",data:doc,message:"Error Base de Datos"})
    })
})
app.post("/api/getInspirationsByType",(req,res)=>{
    Inspiraciones.find({type:req.body.type}).then(doc=>{
        res.json({response:"success",data:doc,message:"Todas las inspiraciones"})
    })
    .catch(err=>{
        res.json({response:"failed",data:doc,message:"Error Base de Datos"})
    })
})

app.post("/api/getUser",(req,res)=>{
    let userId = CryptoJS.AES.decrypt(req.body.id, "clave_secreta").toString(CryptoJS.enc.Utf8)

    Usuarios.find({_id:userId}
        .then(doc=>{
            if(doc.length!==0){
                res.json({response:"success",data:doc,message:"Usuario encontrado"})
            }else{
                res.json({response:"failed",data:doc,message:"Usuario no encontrado"}) 
            }
        })
        .catch(err=>{
            res.json({response:"failed",data:doc})
        })
    )
})
app.post("/api/getUserByMail",(req,res)=>{

    Usuarios.find({mail:req.body.mail}
        .then(doc=>{
            if(doc.length!==0){
                res.json({response:"success",data:doc,message:"Usuario encontrado"})
            }else{
                res.json({response:"failed",data:doc,message:"Usuario no encontrado"}) 
            }
        })
        .catch(err=>{
            res.json({response:"failed",data:doc})
        })
    )
})

app.post("/api/login", (req,res)=>{

    Usuarios.find({
        mail:req.body.mail,
        password:req.body.password
    }).then(doc=>{
        if(doc.length!==0){
            res.json({response:"success",data:doc,message:"Usuario encontrado"})
        }else{
            res.json({response:"failed",data:doc,message:"Usuario no encontrado"}) 
        }
    })
    .catch(err=>{
        res.json({response:"failed",data:doc})
    })
})

// app.get("/api/add", (req,res)=>{
//     const ins = new Inspiraciones({
//         title:"Terreno 8",
//         type:"Terreno",
//         photos:[
//             "https://firebasestorage.googleapis.com/v0/b/greenplace-4f0e2.appspot.com/o/Inspiraciones%2Fterr8.jpg?alt=media&token=b329c57f-18ec-43af-92dc-0c20d653058f"
//         ],
//         description:"Exterior - decoración",    
//     })
//     ins.save().then(doc=>{
//         res.json({response:"success",data:doc,message:"Usuario creado"})
//     })
// })

app.post("/api/register", (req,res)=>{
    if(req.body.mail && req.body.password && req.body.username){
        Usuarios.find({
            mail:req.body.mail,
        }).then(doc=>{
            if(doc.length!==0){
                res.json({response:"failed",data:{},message:"Mail ya registrado"})
            }else{
                const user = new Usuarios({
                    mail:req.body.mail,
                    username:req.body.username,
                    password:req.body.password,
                    favs:[]
                })
                user.save().then(doc=>{
                    res.json({response:"success",data:doc,message:"Usuario creado"})
                })
                .catch(err=>{
                    res.status(400).json({response:"failed",data:doc,message:"Ocurrió un error"})
                })
            }
        })
        .catch(err=>{
            res.json({response:"failed",data:doc,message:"Error Base de Datos"})
        })
    }else{
        res.json({response:"failed",data:{},message:"Parametros incorrectos"})
    }
})

app.post("/api/favs", (req,res)=>{
    if(req.body.param!=="plants" && req.body.param!=="inspirations"){
        res.json({response:"failed",data:{},message:"Parametro mal enviado"})
    }else{
        let newFavs=req.body.favs
        // const encryptedText = CryptoJS.AES.encrypt(plainText, secretKey).toString();
        // const decryptedText = CryptoJS.AES.decrypt(encryptedText, secretKey).toString(CryptoJS.enc.Utf8);
    
        let userId = CryptoJS.AES.decrypt(req.body.id, "clave_secreta").toString(CryptoJS.enc.Utf8)
    
        if(!Array.isArray(newFavs)){
            res.json({response:"failed",data:{},message:"Favoritos mal enviados"})
        }else{
            const update = {$set:{[req.body.param]:newFavs}}
            Usuarios.findByIdAndUpdate(userId, update)
                .then(doc=>{
                    res.json({response:"success",data:doc,message:"Favoritos actualizados"})
                })
                .catch(err=>{
                    res.json({response:"failed",data:doc,message:"Favoritos no actualizados"})
                })
        }
    }
})

app.listen(3000, ()=>{
    console.log("Servidor listo")
})