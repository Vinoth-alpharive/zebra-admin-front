const assetModel = require("../models/assetModel");
const walletModel = require("../models/walletModel")
const overAllTransactionModel = require("../models/overallTransactionsModel")


const ncAdd=(num1,num2,decimal=8)=>{
  let value = parseFloat(num1+num2).toFixed(decimal)
  return value
}
const ncSub=(num1,num2,decimal=8)=>{
let value = parseFloat(num1-num2).toFixed(decimal)
return value
}
const ncMul=(num1,num2,decimal=8)=>{
let value = parseFloat(num1*num2).toFixed(decimal)
return value
}
const ncDiv=(num1,num2,decimal=8)=>{
let value = parseFloat(num1/num2).toFixed(decimal)
return value
}


const overAllTransaction = async (userId=null,coin=null,type=null,amount=null,oldbalance=null,availablebalance=null,actionfrom=null,updatefrom=null,actionid=null,remark=null,credit=null,debit=null)=>{
  try {
      let whereCodn ={}
      whereCodn.user_id=userId;
      whereCodn.coin=coin;
      whereCodn.type=type;
     whereCodn.no_of_token=amount;
      whereCodn.oldbalance=oldbalance;
      whereCodn.availablebalance=availablebalance;
      if(credit){
      whereCodn.credit=credit;
      }
      if(debit){
      whereCodn.debit =debit;
      }

      // console.log(whereCodn);
      whereCodn.updatefrom=updatefrom;
      whereCodn.actionid=actionid;
      whereCodn.remark=remark;
      whereCodn.actionfrom=actionfrom
    
      const createData =await overAllTransactionModel.create(whereCodn)
      return {isError:false,message:"success",result:createData}
  } catch (error) {
      return { isError: true, message: error };
  }
}

const getAddress = async (source, user_id) => {
  try {
    if (source) {
      const constantData = await assetModel.find({
        source: source.toLowerCase(),
      });
      if (constantData && constantData.length >= 0) {
        const findData = await eval(`user_${source.toLowerCase()}_model`).aggregate([{
            '$match': {
                '$and': [
                  {
                    'userId': user_id
                  }, {
                    'coin': source.toLowerCase(),
                  }
                ]
              }
          
        }]);
        if (findData && findData.length>=0) {
          return {isError: false, message: 'success' ,result:findData};
        } else {
          return { isError: true, message: "Invalid userId" };
        }
      } else {
        return { isError: true, message: "Invalid asset" };
      }
    } else {
      return APIRes.getNotExistsResult("required source", res);
    }
  } catch (err) {
    return { isError: true, message: err };
  }
};



const spotCredit =async(user_id=null,source=null,amnt=null,reason=null,type=null,action_id=null,actionfrom=null,update_from='user')=>{
try {
  const assetData = await findOne({source:source.toUpperCase()})
  if(assetData){
  const matchData = await spotWalletModel.aggregate([
    {
      '$match': {
        '$and': [
          {
            'user_id': require('mongoose').Types.ObjectId(user_id)
          }, {
            'currency': source.toUpperCase()
          }
        ]
      }
    }

  ])
  console.log(matchData);
  if(matchData?.length===1){
    const data = Object.assign({}, ...matchData);

    if(amnt>0){
    let oldbalance = data.balance;
    let availablebalance = parseInt(oldbalance)+parseInt(amnt)
    let credit = parseInt(amnt);
    let type ="withdraw"
    let userId =user_id
    let actionid =action_id
    let remark=reason
    let coin =source
    let amount = amnt
    let updatefrom=update_from
    const findData = await overAllTransaction(userId,coin,type,amount,oldbalance,availablebalance,actionfrom,updatefrom,actionid,remark,credit)
    const walletData = await spotWalletModel.findByIdAndUpdate({_id:data._id},{balance:availablebalance},{new:true})
    return {isError:false,message:"success",result:walletData}
    }

  }else{
    let userId=user_id
    let oldbalance = 0.00000000;
    let availablebalance = parseInt(oldbalance)+parseInt(amnt)
    let credit = parseInt(amnt);
    let type ="withdraw"
    let actionid =action_id
    let remark=reason
    let coin =source
    let amount = amnt
    let updatefrom=update_from
    let saveData ={}
    saveData.userId =user_id;
    saveData.currency =source;
    saveData.balance =amnt;
    saveData.escrow_balance =0;
    const findData = await overAllTransaction(userId,coin,type,amount,oldbalance,availablebalance,actionfrom,updatefrom,actionid,remark,credit)
   const createWallet =await spotWalletModel.create(saveData)
   return {isError:false,message:"success",result:createWallet}
  }
}else{
  return { isError: true, message: "invalid asset and userid" };
}
} catch (error) {
  console.log(error);
  return { isError: true, message: error };
}
}

const spotDebit =async(user_id=null,source=null,amnt=null,reason=null,type=null,action_id=null,actionfrom=null,update_from='user')=>{
  try {
    const matchData = await spotWalletModel.aggregate([
      {
        '$match': {
          '$and': [
            {
              'user_id': require('mongoose').Types.ObjectId(user_id)
            }, {
              'currency': source.toLowerCase()
            }
          ]
        }
      }
  
    ])
    if(matchData?.length===1){
      const data = Object.assign({}, ...matchData);
  
      if(amnt>0){
      let oldbalance = data.balance;
      let availablebalance =await ncSub(oldbalance,amount)
      let debit = parseFloat(amnt);
      let type ="deposit"
      let userId =user_id
      let actionid =action_id
      let remark=reason
      let coin =source
      let amount = amnt
      let updatefrom=update_from
      const findData = await overAllTransaction(userId,coin,type,amount,oldbalance,availablebalance,actionfrom,updatefrom,actionid,remark,debit)
      const walletData = await spotWalletModel.findByIdAndUpdate({_id:data._id},{balance:availablebalance},{new:true})

      return {isError:false,message:"success",result:walletData}
      }
  
    }else{
      return { isError: true, message: "invalid asset and userid" };
    }
  } catch (error) {
    console.log(error);
    return { isError: true, message: error };
  }
  }

const escrowCredit=async(userId,coin,type,amount,actionfrom,updatefrom,actionid,remark)=>{
  try {
    const matchData = await spotWalletModel.aggregate([
      {
        '$match': {
          '$and': [
            {
              'user_id': require('mongoose').Types.ObjectId(userId)
            }, {
              'currency': coin.toUpperCase()
            }
          ]
        }
      }
  
    ])
    if(matchData&&matchData?.length>=0){
      const data = Object.assign({}, ...matchData);
 
      if(data.balance >= amount){
        let whereCodn={}
      let balance = ncSub(data.balance,amount)
      let escrow_balance = ncAdd(data.escrow_balance,amount)
       whereCodn.balance =balance;
       whereCodn.escrow_balance=escrow_balance;
      let updateQuery={
        $set:whereCodn
      }
      
      const updateData = await spotWalletModel.findByIdAndUpdate({"_id":data._id},updateQuery,{new:true})
      const overAllData =await overAllTransaction(userId,coin,type,amount,data.balance,whereCodn.balance,actionfrom,updatefrom,actionid,remark,amount)
      return {isError:false,message:"success",result:updateData,overAllData}  
    }else{
        return { isError: true, message: "invaild balance" };
      }
    }else{
      return { isError: true, message: "invaild asset and userid" }
    }
  } catch (error) {
      return { isError: true, message: error };
  }

  }

  const escrowDebit=async(userId,coin,amount)=>{

    try {
  
      const matchData = await spotWalletModel.aggregate([
        {
          '$match': {
            '$and': [
              {
                'user_id': require('mongoose').Types.ObjectId(userId)
              }, {
                'currency': coin.toUpperCase()
              }
            ]
          }
        }
    
      ])
   
      if(matchData && matchData.length>=0){
       
        const data = Object.assign({}, ...matchData);
        let whereCodn={}
        if(data.escrow_balance >= amount){
        let escrow_balance = ncSub(data.escrow_balance,amount)
         whereCodn.escrow_balance=escrow_balance;
        let updateQuery={
          $set:whereCodn
        }
      
        const updateData = await spotWalletModel.findByIdAndUpdate({"_id":data._id},updateQuery,{new:true})
        return {isError:false,message:"success",result:updateData}  
      }else{
          return { isError: true, message: "invaild balance" };
        }
      }else{
        return { isError: true, message: "invaild asset and userid" }
      }
    } catch (error) {
      console.log(error);
        return { isError: true, message: error };
    }
  
    }

  module.exports ={
    ncAdd,ncDiv,ncSub,ncMul,getAddress,escrowCredit,escrowDebit,spotCredit,spotDebit,overAllTransaction
  }
 