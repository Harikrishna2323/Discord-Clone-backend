const User = require('../models/User');

exports.getAllUsers = async(req,res) =>{
    const users = await User.find();
    res.status(200).json({users})
}

//get one user ==> /api/users/:id
exports.getOneUser = async(req,res) =>{
    const {id} = req.params;
    try{
        const user = await User.findById(id);
        res.status(200).json({
            user
        })
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

//update user ==> /pai/users/update/:id
