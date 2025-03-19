const {responseInValid, responseServerError, responseSuccessWithData, reponseSuccess, responseNotFound} = require("../helper/ResponseRequests")
const { v4: uuid } = require("uuid");
const Joi = require("joi")
// const data_exporter = require("json2csv").Parser
const Posts = require("../model/post.model")
const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require("fs")
const iconv = require("iconv-lite")
const path = require("path");
const Posts2 = require("../model/post2.model");
const Summary = require("../model/sumary.mode");
const postSchema = Joi.object().keys({
    title: Joi.string(),
    content:  Joi.string(),
    author: Joi.string(),
    url:  Joi.string(), 
    images:Joi.array().items(Joi.string()),
    videos:Joi.array().items(Joi.string()),
    sensetive:  Joi.number().default(0)
})


const getPostFacebook = async (req, res) => {
    
  return reponseSuccess({res}) 

}

const create = async (req,res) => {
   
   const checkValidate = postSchema.validate(req.body)
   if(checkValidate.error) {
       console.log(checkValidate.error)
       return responseServerError({res, err: checkValidate.error.message})
   }
   checkValidate.value.postId = uuid()
   const newPost = new Posts(checkValidate.value)
   await newPost.save()
   return responseSuccessWithData({res, data: newPost})
}

const update = async (req,res) => {
    const {postId} = req.params
    const checkValidate = postSchema.validate(req.body)
    if(checkValidate.error) {
        return responseServerError({res, err: checkValidate.error.message})
    }

    const post = await Posts.findOne({postId: postId})
    if(!post) return responseNotFound({res, message:"not found"})
    await  post.update(checkValidate.value)

    return responseSuccessWithData({res, data: post})

}

const detail = async (req,res) => {
    const {postId} = req.params
    const post = await Posts.findOne({postId: postId})
    if(!post) return responseNotFound({res, message:"Not found"})
    return responseSuccessWithData({res, data: post})
}


const deletePost = async (req,res) => {
    const {postId} = req.params
    const post = await Posts.findOneAndUpdate({postId: postId})
    if(!post) return responseNotFound({res, message:"Not found"})
    return reponseSuccess({res})
}

const get = async (req,res) => {
    const {search} = req.query
    const {limit, offset} = req.pagination
    let options = {}
    // const data = await Posts.find(options).skip(offset).limit(limit).sort("createdAt")
    // const count = await Posts.find(options).countDocuments()
    const test = await Summary.find()
    const data = await Summary.find(options).skip(offset).limit(limit).sort("createdAt")
    const count = await Summary.find(options).countDocuments()
    return responseSuccessWithData({res, data :{
        data,
        count,
        page: parseInt(req.query.page)
    } })
}

const exportExcel =async (req, res) => {
    const data = await Posts.find({sensetive: 0});
    var dataCSv = JSON.parse(JSON.stringify(data))
    const newData = dataCSv.map((item) => {
          return {
            // link: item?.url || "",
            content: item?.content ? item?.content :   ""
          }
    })
    // var file_header = ["Nội dung"]
    // const json_data = new data_exporter({file_header})
    // const csv_data = json_data.parse(newData)

    const pathFileData = path.join(__dirname,"..", "data")
    data.forEach(async (item) => {
        await fs.writeFileSync(`${pathFileData}/${item.postId}.txt`, item.content)
    })
   
    const csv_data = convertArrayToCSV(newData);
    fs.writeFileSync("output.csv", csv_data, err => {
        if(err) {
            console.log(err)
        }
        console.log("csv file successfully")
    })
    res.send("success")

    // res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
    // res.set('Content-Type', 'text/csv');
    // res.send(encodedData);

}

const exportExcel2 =async (req, res) => {
    const data = await Posts.find({sensetive: 0});
    var dataCSv = JSON.parse(JSON.stringify(data))
    const newData = dataCSv.map((item) => {
          return {
            content: item?.content || ""
          }
    })

 
    
    const csv_data = convertArrayToCSV(newData);
    fs.writeFileSync("output.csv", csv_data, err => {
        if(err) {
            console.log(err)
        }
        console.log("csv file successfully")
    })
    // fs.writeFileSync("output.csv", csv_data, err => {
    //     if(err) {
    //         console.log(err)
    //     }
    //     const filePath = path.join(__dirname,"output.csv")
    //     if(fs.existsSync(filePath)) {
    //         fs.readFileSync()
    //     }
    // })

    const filePath = path.join(__dirname,"..", "output.csv")
    const file = fs.readFileSync(filePath)
    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
    res.set('Content-Type', 'text/csv');
    res.send(file);


}


const thongKe = async (req, res) => {
   const data = await Posts.aggregate([
     {
        $group: {
            // _id:{url: "$url", title: "$title"},
            _id:"$title",
            count: { $sum: 1 }
        },
     },
     {
        $sort: { count: -1 }
    }, 
    {
        $limit: 10 
    }
   ])
   return responseSuccessWithData({
    res,
    data: data
   })
}

const thongKe2 = async (req, res) => {
    const limit = req.query.limit || 10
    const data = await Posts2.aggregate([
      {
         $group: {
             // _id:{url: "$url", title: "$title"},
             _id:"$title",
             count: { $sum: 1 }                                                                                                                                                                                         
         },
      },
      {
         $sort: { count: -1 }
     }, 
     {
         $limit: parseInt(limit) 
     }
    ])
    return responseSuccessWithData({
     res,
     data: data
    })
 }

 const thongketheothang = async (req, res) => {
    const title = req.query.title;
    const currentYear = new Date().getFullYear();
    const dataCurrentYear = await Posts2.aggregate([
        {
            $match: { title:  title,
                "createdAt": {
                    $gte: new Date(currentYear, 0, 1), // Bắt đầu từ đầu năm hiện tại
                    $lt: new Date(currentYear + 1, 0, 1) // Trước đầu năm tiếp theo
                }
            },
            
        },
        {
            $group: {
                _id: {
                    // year: { $year: currentYear },
                    month: { $month: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {  "_id.month": 1 }
        }
    ]);

     const dataPreYear = await Posts2.aggregate([
        {
            $match: { title:  title,
                "createdAt": {
                    $gte: new Date(currentYear - 1, 0, 1), // Bắt đầu từ đầu năm hiện tại
                    $lt: new Date(currentYear -1  + 1, 0, 1) // Trước đầu năm tiếp theo
                }
            },
            
        },
        {
            $group: {
                _id: {
                    // year: { $year: currentYear },
                    month: { $month: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {  "_id.month": 1 }
        }
    ]);

   const data ={
    currentYear: {
        year: currentYear,
        data: dataCurrentYear,
    },
    preYear: {
        year: currentYear - 1,
        data: dataPreYear,
    }
   }
    return responseSuccessWithData({
        res,
        data: data
    });
};

 

const getUrlPageNhayCam = async (req, res) => {


}



module.exports = {
    create, update, deletePost, detail, get, exportExcel,exportExcel2, thongKe, getUrlPageNhayCam, getPostFacebook, thongKe2, thongketheothang
}