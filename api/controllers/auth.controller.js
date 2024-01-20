import bcryptjs from "bcryptjs";
import User from '../models/user.models.js';
import {errorHandler} from "../utils/error.js";
import jwt from "jsonwebtoken";
 export const  signup  = async (req,res,next)=>{

    const {username , email , password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10)
    const newUser = new User ({username , email,password:hashedPassword});
    try {
        await newUser.save();
        res.status(201).json("user created successfully");
    }catch(error)
    {
       next(errorHandler(error.statuscode,error.message));
    }
    
    

};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid credentials"));
    
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    
    res
    .cookie("access_token", token, { httpOnly: true })
    .status(200)
    .json("User logged in Successfully");
    } catch (error) {
    next(error);
    }
    };

//export default signup;
