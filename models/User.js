const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String },
  mail: { type: String },
  password: { type: String },
  isAdmin: {
    type: Boolean,
    default: false
  },
  friends:[
          {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ] 
},{timestamps: true});

userSchema.pre('save',async function(next){
  if(!this.isModified('password')){
    next();
  }
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.generateToken = async function(id, mail){
  return jwt.sign({id, mail}, process.env.JWT_SECRET,{
    expiresIn: '10d'
  })
};

userSchema.methods.comparePasswords = async function(enteredPassword){
  return bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model("User", userSchema);
