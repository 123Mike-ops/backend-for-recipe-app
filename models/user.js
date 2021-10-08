const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const userSchema=mongoose.Schema({
    userName:{type:String},
    email:{type:String},
    password:{type:String}
})
userSchema.pre('save',async function(next){
    const user=this;
    if(user.isModified("password")){
            user.password=await bcrypt.hash(user.password,8);
    }
    next();
})
userSchema.methods.correctPassword=async function(candidiatePassword,userPassword){
    return await bcrypt.compare(candidiatePassword,userPassword);
};
const User=mongoose.model("User",userSchema)
module.exports=User;