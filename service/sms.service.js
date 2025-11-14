import twilio from "twilio"



const accountSid ="AC42296b792fa8bbfa1f3e9c779c4539a6";
const authToken ="beb24e4be582373b013e7622b0eeb76a";
const client = twilio(accountSid, authToken);

export async function createMessage(number , studentName) {
        try {
            
            const message = await client.messages.create({
            //   body: `Smart Mess System: Your mess fee has been received successfully. Thank you.`,
             body : `Smart Mess System: Your fee payment of Rs 3300 has been successfully processed. Thank you, ${studentName}.`,
                from: "+16506754792",
                to: `+91${number}`,
            });

            console.log(message);
            
            return {
                success : true,
                message : "sent sms successfully!"
            }

        } catch (error) {
            console.log("error : " , error);
             return {
                success : false,
                message : "sent sms failed!"
            }
        }
}