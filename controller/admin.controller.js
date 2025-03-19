const {responseInValid, responseServerError, responseSuccessWithData, reponseSuccess, responseNotFound} = require("../helper/ResponseRequests")
const Joi = require("joi")
const { v4: uuid } = require("uuid");
const Users = require("../model/user.model")
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const userCreateChema = Joi.object().keys({
    displayName: Joi.string().required(),
    username:  Joi.string().required(),
    password:  Joi.string().required(),
    email:  Joi.string().email().required(),
    phonenumber: Joi.string(),
    role: Joi.string().default("U")
})

const userUpdateSchema = Joi.object().keys({
    displayName: Joi.string(),
    username:  Joi.string(),
    email:  Joi.string().email(),
    phonenumber:  Joi.string(),
})

const listUsers = async (req,res) => {
    const {search} = req.query
    const {limit, offset} = req.pagination
    let options = {}
    if (search && search !== "") {
        options = {
            ...options,
            
            $or: [
                { displayName: new RegExp(search.toString(), 'i')},
                { username: new RegExp(search.toString(), 'i')},
                { email: new RegExp(search.toString(), 'i')},
                { phonenumber: new RegExp(search.toString(), 'i')},
            ]
            
        }

    }

    const data = await Users.find(options).skip(offset).limit(limit)
    const count = await Users.find(options).countDocuments()
    return responseSuccessWithData({res, data :{
        data,
        count,
        page: parseInt(req.query.page)
    } })

}
const createUser = async (req, res) => {
    const checkValiate = userCreateChema.validate(req.body)
    if(checkValiate.error) {
        return responseServerError({res, err: checkValiate.error.message})
    }
    const hashPassword = await bcrypt.hashSync(req.body.password, salt);
    checkValiate.value.userId = uuid()
    checkValiate.value.password = hashPassword
    const newUser = new Users(checkValiate.value)
    await newUser.save()
    return responseSuccessWithData({res, data: newUser})
}

const deleteUser = async (req, res) => {
    const {userId} = req.params
    const user = await Users.findOneAndDelete({userId: userId})
    if(!user) return responseNotFound({res, message:"not foud user"})
    return reponseSuccess({res})
}

const getDetail = async (req, res) => {
    const {userId} = req.params
    const user = await Users.findOne({userId: userId})
    if(!user) return responseNotFound({res, message:"not foud user"})
    return responseSuccessWithData({res, data: user})
}

const updateUser = async (req, res) => {

    const checkValidate = userUpdateSchema.validate(req.body)
    if(checkValidate.error) {
        return responseServerError({res, err: checkValidate.error.message})
    }

    const user = await Users.findOneAndUpdate({userId: req.params.userId},checkValidate.value)
    if(!user) return responseNotFound({res, message:"not found"})
    return responseSuccessWithData({res, data: user})

}

module.exports = {
    createUser,
    deleteUser,
    updateUser,
    listUsers,
    getDetail
}