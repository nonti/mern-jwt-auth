import jwt from 'jsonwebtoken';


const userAuth = async (req, res, next) => {
  const {token} = req.cookies;
  if(!token){
    return res.json({success: false, message: 'Unauthorized'});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(decoded.id){
      req.body.userId = decoded.id;
    }else {
      return res.json({success: false, message: 'Not Authorized'});
    }
    next();
  } catch (error) {
    res.json({ success: false, message: error.message})
  }
}

export default userAuth;