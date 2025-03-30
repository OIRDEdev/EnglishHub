import { S3 } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';  

// Load environment variables
dotenv.config();

const ACCESS_KEY = process.env.R2_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const ENDPOINT = process.env.R2_ENDPOINT;

if (!ACCESS_KEY || !SECRET_ACCESS_KEY || !BUCKET_NAME || !ENDPOINT) {
  throw new Error("Missing required R2 configuration in environment variables.");
}
/*
class S3Service {
  private static instance: S3;

  private constructor(){}

  public static getInstance(): S3 {
    if(!this.instance){
      this.instance = new S3 ({
        endpoint: ENDPOINT,
        signatureVersion: "v4",
        region: "auto",
        credentials: {
          accessKeyId: ACCESS_KEY || '',
          secretAccessKey: SECRET_ACCESS_KEY || '',
        }
      });
    }
    return this.instance;
  }

  private static getPresignedUrl(operation: "getObject" | "putObject", key: string, expiresIn: number = 3600): Promise<string>{
    const s3 = this.getInstance();
    const params = {
      Bucket: BUCKET_NAME,
      key: key,
      Expires: expiresIn,
    };
    return new Promise((resolve, reject) => {
      s3.getSignedUrl(operation, params, (err, url) => {
        if(err){
          reject(err);
        }else{
          resolve(url);
        }
      });
    });
  }
}
*/


const s3 = new S3({
  endpoint: ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY 
  }
});


async function Fetchhistory(fileKey: string, isaudio: boolean = false) {
  try {
    if (!BUCKET_NAME) {
      throw new Error("BUCKET_NAME is not defined in environment variables");
    }
    
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey
    };

    console.log(`Fetching file: ${fileKey} from bucket: ${BUCKET_NAME}`);
    const response = await s3.getObject(params);
    const data = await response.Body?.transformToByteArray();
    
    if (!data) {
      throw new Error("File not found or empty in R2");
    }
    
    if (!isaudio) {
      const jsonString = new TextDecoder().decode(data);
      return JSON.parse(jsonString); 
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching file from R2:", error);
    return null;
  }
}

export default Fetchhistory;