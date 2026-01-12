import {razorpay} from "../config/razorpay.js"
import crypto from "crypto"
import { StudentApplication } from "../model/StudentApplication.js";
import { FeeModel } from "../model/fees.model.js";
import { recordFeeOnBlockchain } from "../service/blockchain.service.js";



export const createOrder = async (req, res) => {
    try {
        // const userId = req.user._id;
        const {student_id , month} = req.body;


        //finde stundet application
        const student = await StudentApplication.findOne({
            student_id : student_id
        });


        if(!student){
        return  res.status(400).json({ success: false, message: "Student is not Found!" });
        }



       //create order
        const options = {
            amount: 3300 * 100, // convert to paise
            currency: "INR",
            receipt: "receipt_smart_Mess_system_"+ Date.now(),
        };

        const order = await razorpay.orders.create(options);


        //save in database
            const record = await FeeModel.create({
                user: student._id,
                student_Id : student_id,
                studentEmail : student.email,
                studentName : student.name,
                razorpay_Order_Id : order.id,
                month : month,
                amount : 3300,
                method : "online",
                status: "pending",
            });


        if(!record){
        return  res.status(500).json({ success: false, message: "Student create record failed!" });
        }

        // console.log("user order : " , order , " and record : " , record);
        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Create Order Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const record = await FeeModel.findOne({
      razorpay_Order_Id: razorpay_order_id,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    //  Idempotency check
    if (record.hash) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");


    //check if not return 
    if (expectedSignature !== razorpay_signature) {
        //update 
      await FeeModel.updateOne(
        { razorpay_Order_Id: razorpay_order_id },
        { status: "failed" }
      );

      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }


    //  Write to blockchain FIRST
    const { blockNumber, txHash } = await recordFeeOnBlockchain(
      Number(record.student_Id),
      record._id.toString(),
      Number(record.amount),
      record.method
    );

    //  Update DB only after blockchain success
    record.status = "paid";
    record.razorpay_Payment_Id = razorpay_payment_id;
    record.blockNumber = blockNumber;
    record.hash = txHash;
    record.createdAt = new Date();

    await record.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and recorded on blockchain",
      txHash,
    });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};




//  export const verifyPayment = async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//             req.body;


//             const record = await FeeModel.findOne({
//             razorpay_Order_Id: razorpay_order_id,
//             });

//             if (!record) {
//             return res.status(404).json({ success: false, message: "Order not found" });
//             }


//             console.log("user record info : " , razorpay_order_id, razorpay_payment_id, razorpay_signature)

//         const body = razorpay_order_id + "|" + razorpay_payment_id;

//         const expectedSignature = crypto
//             .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//             .update(body)
//             .digest("hex");

//         if (expectedSignature === razorpay_signature) {
            
//             //finde user order and update status

//              const  record =   await FeeModel.findOneAndUpdate(
//                 { razorpay_Order_Id: razorpay_order_id },
//                 {
//                     status: "paid",
//                     razorpay_Payment_Id: razorpay_payment_id,
//                     createdAt: new Date(),
//                 },
//                 { new: true }
//                 );
//             // after paid update on blokchain
//              //after add on blockchain
//              const {blockNumber , txHash } = await recordFeeOnBlockchain(Number(record.student_Id), record._id.toString(), Number(record.amount), record.method);
//              //update this record
//              record.blockNumber = blockNumber;
//              record.hash = txHash;
//              await record.save();

               
//             return res.status(200).json({
//                 success: true,
//                 message: "Payment Verified Successfully",
//             });


//         } else {

//              //1 .finde user order delete  bec not paymentsuccessfulled
//             // await FeeModel.findOneAndDelete({
//             //     razorpay_Order_Id : razorpay_order_id
//             // } , {new : true});
            
//             //2 . not delete just update failed
//             await FeeModel.findOneAndUpdate(
//             { razorpay_Order_Id: razorpay_order_id },
//             { status: "failed" }
// );




//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Signature",
//             });
//         }

//     } catch (error) {
//         console.error("Verify Payment Error:", error);
//         res.status(500).json({ success: false, message: "Server Error" });
//     }
// };