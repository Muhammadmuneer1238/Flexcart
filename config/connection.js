const mongoose= require('mongoose')
mongoose.connect('mongodb+srv://muneer1238:gYAvTwYkC5iP%40bU@cluster0.mymtvtn.mongodb.net/Shoppingcart')
const db=mongoose.connection


db.on('error',(error)=>{
    console.log('Connection error');
})
db.once('open',()=>{
    console.log("connected to the port");
})
module.exports=db


