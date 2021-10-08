require('dotenv').config();

const app=require('./express')
const mongoose=require('mongoose')

const port=process.env.PORT||5000;
mongoose.connect(process.env.MONGOURI,{useNewUrlParser:true,
    useUnifiedTopology:true});
mongoose.connection.on('connected',()=>{
    console.log('connected to database');
});
app.listen(port, () => {console.log(`Listening on port ${port}`)});