const userModel = require('../models/userSignup')
const validation = require('../utilities/validation')
const bcrypt = require('bcrypt')
module.exports = {
    postUserSignup: async (req, res) => {
        try {
            const { fullName, email, password, confirmPassword } = req.body
            const exisistUser = await userModel.findOne({ email })
            if (exisistUser) {
                return res.status(400).json('User already exist')
            }
            else if (!validation.validationFields([fullName, email, password, confirmPassword])) {
                return res.status(400).json('All fields are required')
            } else if (!validation.emailValidation(email)) {
                return res.status(400).json('Invalid email format')
            } else if (!validation.pwdValidation(password)) {
                return res.status(400).json('Invalid password format')
            } else if (!validation.confirmPwd(password, confirmPassword)) {
                return res.status(400).json('password and confirm password should match')
            } else {
                const hashPassword = await bcrypt.hash(password, 10)
                const newUser = new userModel({
                    fullName,
                    email,
                    password: hashPassword
                })
                await newUser.save()
                res.status(200).json('user registerd Successfull')
            }
        } catch (error) {
            console.log(error);
        }
    },
    postUserLogin:async(req,res)=>{
        const {email,password} = req.body
        const exisistUser = await userModel.findOne({ email })
        if(!exisistUser){
            return res.json('User does not exist ')
        }else{
            const passwordCheck = await bcrypt.compare(password,exisistUser.password)
            if(passwordCheck){
                res.status(200).json('login success')
            }else{
                res.status(400).json('Invalid password')
            }
        }
    }

}