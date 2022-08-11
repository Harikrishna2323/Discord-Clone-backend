const User = require('../models/User');

exports.login = async(req,res) =>{
    const {mail, password}  = req.body;
    try{
        const user = await User.findOne({mail});
        if(user  && (await user.comparePasswords(password))){
            const token = await user.generateToken(user._id, user.mail);
            res.status(200).json({
                token, user
            })
        }else{
            return res.status(400).json({
                message: "Invalid cerdentials. Try again"
            })
        }
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

exports.register = async(req,res) =>{
    const { username, mail, password} = req.body;
    try{
        const existingUser = await User.findOne({mail});
        if(existingUser){
            return res.status(400).json({
                message: "Mail already registered."
            })
        }else{
            const user = await User.create({
                username, mail, password
            });
            res.status(201).json({
                user
            })
        }
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

