import userService from "../services/user.service.js";


const getUserProfile = async (req, res, next) =>{
  try {
    const {username} = req.body;
    const {db} = req.app.locals.db;
    const user = await  userService.getUser(usernamen, db);


    if (!user){
        return res.status(401).json({
          status : "fail",
          message : "usernotfound"
        })
    }
    res.status(200).json({status : 'success', data : user});
  } catch(err){
    next(err);
  }
}
  



const addUser = async (req, res, next) =>{
  try{
    const {username, email, password} = req.body;
    const {db} = req.app.locals.db;
    const user = await userService.addUser(username, email, password, db);
    if (!user){
        return res.status(404).json({
          status : "fail",
          message : "coudn't add the user"
        })
    }
    res.status(200).json({status : 'success'})
  } catch(err){
      next(err)
  }
}



export const deleteUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const db = req.app.locals.db;

    const user = await userService.deleteUser(username, db);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "user not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};



