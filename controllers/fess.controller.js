import { ApiError } from "../utils/ApiError.js";
import { asyncWraper } from "../utils/AsyncWraper.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { FeeModel } from "../model/fees.model.js";
import moment from "moment";






const  studentAddFees = asyncWraper(async(req , res)=>{
 const {  user , student_Id, studentName, studentEmail, month, amount, method } = req.body;


 if(!user || !studentName || !studentEmail || !student_Id || !month || !amount || !method){
    throw new ApiError(400 , "Invalide Error" ,  "All fileds are required !")
 }

    //check alreay paied
    const existing = await FeeModel.findOne({
        student_Id : student_Id,
        month : month
    });

    // const currentMonth = moment().format("MMMM");

    // console.log(existing.month , currentMonth);

    // console.log(existing);


    // if(existing.month ===  month ){
    // throw new ApiError(400 , "Invalide Error" ,  "Student Alreay paid This month!");
    // }

       if( existing ){
    throw new ApiError(400 , "Invalide Error" ,  "Student Alreay paid This month!");
    }


    const record = await FeeModel.create({
       user ,
      student_Id,
      studentEmail,
      studentName,
      month,
      amount,
      method,
      status: "paid",
    })

    
 if(!record){
    throw new ApiError(500 , "Database Error" ,  " Error adding fee")
 }


 return res.status(200)
            .json(
                new ApiResponse(200,
                    record,
                    "Fee recorded successfully"
                )
            )

    
})



// Get All Fees Records
const allFeesRecords = asyncWraper(async(req , res)=>{

    const allRecords = await FeeModel.find();

     return res.status(200).json(allRecords);
})


// Get Current Month Paid Students

const currentFeeRecords = asyncWraper(async(req , res)=>{
 const currentMonth = moment().format("MMMM"); // November
  const fees = await FeeModel.find({ month: currentMonth });

  return res.status(200).json(fees);
})



//get praticlur records
const getStudentFeesRecordsById = asyncWraper(async(req , res)=>{
    const id = req.params.id;
     if(!id){
    throw new ApiError(400 , "Invalide Error" ,  "Id are required !")
     }

     //finde and return
     const records = await FeeModel.find({
        student_Id : id
     });


      return res.status(200).json(records);

})


 export {
    studentAddFees,
    allFeesRecords,
    currentFeeRecords,
    getStudentFeesRecordsById
}