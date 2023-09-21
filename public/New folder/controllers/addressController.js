const walletModel =require('../models/walletModel')
const AppUser = require('../models/appuserModel')
var axios = require('axios');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('betting-user');

//user wallet address generation
exports.generateUsersAddress = async(userId,coin)=>{
    try {
        const findData =await walletModel.findOne({ user_id: userId })
        // if (findData.length <= 0) {
        // var config = { method: 'post',url: `https://api.blockcypher.com/v1/${coin}/main/addrs`, headers: { }};
        // }
        // const response = await axios(config);
        // const result = response.data;
        if(!findData){
        let saveData={}
        // saveData.address ="0x"+result.address;
        // saveData.asset = coin;
        saveData.user_id=userId;
        // const publicFirst = result.public.substring(0,Math.ceil(result.public.length/2))
        // const publicSecond =result.public.substring(Math.ceil(result.public.length/2),Math.ceil(result.public.length))
        // const privateFirst = result.private.substring(0,Math.ceil(result.private.length/2))
        // const privateSecond =result.private.substring(Math.ceil(result.private.length/2),Math.ceil(result.private.length))
        // saveData.pubping = cryptr.encrypt(publicFirst )
        // saveData.pubpong = cryptr.encrypt(publicSecond)
        // saveData.priping = cryptr.encrypt(privateFirst)
        // saveData.pripong = cryptr.encrypt(privateSecond)
        const insert = await walletModel.create(saveData)
        const update = await AppUser.findByIdAndUpdate({_id:userId},{is_address:true},{new:true})
        }
    } catch (error) {
        console.log(error);  
    }
  }