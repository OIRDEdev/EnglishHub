import S3 from "aws-sdk/clients/s3.js";
import dotenv from 'dotenv';  

const result = dotenv.config();
if (result.error) {
    throw result.error; 
}

const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;

const s3 = new S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});


async function Fetchhistory(fileKey: string, isaudio: boolean){
    try{
        if (!BUCKET_NAME) {
            throw new Error("BUCKET_NAME is not defined in environment variables");
        }
        const params = {
            Bucket: BUCKET_NAME,
            Key: fileKey
        };


        const data = await s3.getObject(params).promise();

        if (!data.Body) {
            throw new Error("File not found or empty in R2");
        }
        if(!isaudio){
            const jsonString = data.Body.toString('utf-8'); 
            return JSON.parse(jsonString); 
        }else{
            return data.Body;
        }

    }catch(error){
        console.error("❌ Error fetching file from R2:", error);
        return null;

    }
}

export default Fetchhistory;