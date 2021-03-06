var express= require('express');
var router = express.Router();
var ObjetoID = require('mongodb').ObjectID;

function initPlanta(db){
    var plantasColl = db.collection('plantas');
    router.get('/', (req, res , next)=>{
        plantasColl.find().toArray((err, plantas)=>{
            if(err){
                console.log(err);
                return res.status(404).json({"error":"Error al extraer plantas de la base de datos"});
            }
            return res.status(200).json(plantas);
        });
    }); //get all
    router.get('/:id', (req, res, next)=>{
        var id = new ObjetoID(req.params.id);
        plantasColl.findOne({"_id": id}, (err, doc)=>{
           if(err){
               console.log(err);
               return res.status(404).json({"error":"Error al extraer plantas de la base de datos"});
           } 
           return res.status(200).json(doc);
        });//findone
    });// /:id

    router.post('/', (req, res, next)=>{
       var newPlanta = Object.assign({}, 
        {
            "nombre":"",
            "tipo":"",
            "taxonomia":"",
            "uso":"",
            "fechacreado": new Date().getTime(),
            "views":0,
            "likes":0
        },
        req.body
        ); 
        plantasColl.insertOne(newPlanta, (err, rslt)=>{
                if(err){
                    console.log(err);
                    return res.status(404).json({"error":"Error al extraer plantas de la base de datos"});
                }
                if(rslt.ops.length===0){
                    console.log(rslt);
                    return res.status(404).json({"error":"Error al extraer plantas de la base de datos"});
                } 
                return res.status(200).json(rslt.ops[0]);
        });
    }); //post
    return router;
}

module.exports = initPlanta;