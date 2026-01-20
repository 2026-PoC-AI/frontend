import { getPresignedUploadUrl } from "../../api/s3Api";

export default function useS3Upload() {
  const uploadFile = async ({ file, domain, stage }) => {
    if (!file) throw new Error("file is required");

    const extension = file.name.split(".").pop();

    // presigned url 요청
    const presigned = await getPresignedUploadUrl({
      domain,
      stage,
      extension,
      contentType: file.type,
    });

    // 실제 S3 업로드
    const putRes = await fetch(presigned.url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!putRes.ok) {
      throw new Error("S3 upload failed");
    }

    // DB 저장용 key 반환
    return presigned.key;
  };

  return { uploadFile };
}
