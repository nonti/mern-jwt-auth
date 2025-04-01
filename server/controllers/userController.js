

export const getUserInfo = async(req, res) => {
  try {
    const {userId} = req.body;

    const user = await userModel.findById(userId);
    if(!user){
      return res.json({success: false, message: 'User not found'})
    }
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}