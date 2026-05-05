import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3_ACCESS_KEY, S3_ACCESS_KEY_ID } from "src/config";

export const uploadFileToS3 = async (key: string, fileContent: string) => {
  const bucketName = "dishash-s3";
  const s3Client = new S3Client({
    region: "ru-central1",
    endpoint: "https://storage.yandexcloud.net",
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: S3_ACCESS_KEY ?? "",
    },
  });

  const params = {
    Body: fileContent,
    Bucket: bucketName,
    Key: key,
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    console.log("File uploaded successfully", response);
  } catch (error) {
    console.error("Error uploading file", error);
  }
};
