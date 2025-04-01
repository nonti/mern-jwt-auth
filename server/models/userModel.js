import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname:{ type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOtp: {type: String, default: ''},
  verifyOtpExpireAt: {type: Number, default: 0},
  isAccountVerified: {type: Boolean, default: false},
  resetOtp: {type: String, default: ''},
  resetOtpExpireAt: {type: Number, default: 0},
}, {timestamps: true});


//Hash Password before saving to database
userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Compare password
userSchema.methods.matchedPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
}

const userModel = mongoose.models.users || mongoose.model('User', userSchema);

export default userModel;


