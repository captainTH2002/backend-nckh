const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const Users = require("../model/user.model")
const security = require("../utils/security")
const {responseInValid, reponseSuccess, responseSuccessWithData, responseNotFound} = require("../helper/ResponseRequests")
const Joi = require("joi")
const { v4: uuid } = require("uuid");

const registerSchema = Joi.object().keys({
    displayName: Joi.string().required(),
    username:  Joi.string().required(),
    password:  Joi.string().required(),
    email:  Joi.string().email().required(),
    phonenumber: Joi.string(),
    role: Joi.string().default("U")
})

const login = async (req, res) => {
    const {username, password} = req.body
    const user = await Users.findOne({username: username})
    if(!user) {
        return responseNotFound({res, message:"Not found user"})
    }

    let check = bcrypt.compareSync(password, user.password)
    if(!check) return responseInValid({res, message:"password incorrect"})

    const access_token  = security.generateToken({username: user.username, role: user.role}, "1h")
    const refresh_token = security.generateRFToken({username: user.username, role: user.role}, "365d")

    user.refreshToken = refresh_token
    await user.save()
    return responseSuccessWithData({res, data: {...user, access_token: access_token}})

}

const register =async (req, res) => {
    const {username, email} = req.body
    const checkValidate = registerSchema.validate(req.body)
    if (checkValidate.error) return responseInValid({res, message: checkValidate.error.message})

    const user = await Users.findOne({
        $or: [
            {username: username},
            {email: email}
        ]
    })

    if(user) return responseInValid({res, message:"email or username exists"})
    const hashPassword = await bcrypt.hashSync(req.body.password, salt);
    checkValidate.value.userId = uuid()
    checkValidate.value.password = hashPassword
    const newUser = new Users(checkValidate.value)
    await newUser.save()
    return responseSuccessWithData({res, data: newUser})
}

const changePassowrd = async (req, res) => {
    const {username, old_password, new_password} = req.body

    const user = await Users.findOne({username: username})

    if(!user) return responseNotFound({res, message:"Not found user"})

    let check = bcrypt.compareSync(old_password, user.password)
    if(!check) return responseInValid({res, message:"password incorrect"})

    const hashPassword = await bcrypt.hashSync(new_password, salt);
    user.password = hashPassword
    await user.save()
    return reponseSuccess({res})
    

}

const refreshToken = async (req, res) => {
    const data = security.verifyRFToken(req.body.refresh_token)
    const access_token = security.generateToken(data.user, '1h');
    return responseSuccessWithData({res, data: {
      access_token: access_token
    }})

}
module.exports = {
    login, 
    register, 
    changePassowrd,
    refreshToken
}