import twilio from "twilio"



const accountSid ="AC42296b792fa8bbfa1f3e9c779c4539a6";
const authToken ="41734cdee7c1c9bd734e4efba9376f69";
const client = twilio(accountSid, authToken);

export async function createMessage(number=7249824513) {
        try {

            console.log("number is : " , number);
            
            const message = await client.messages.create({
              body: `Smart Mess System: Your mess fee has been received successfully. Thank you.`,
            //  body : `Smart Mess System: Your fee payment of Rs 3300 has been successfully processed.`,
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