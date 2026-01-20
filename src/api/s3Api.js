import axios from "./axios";

/**
 * Presigned PUT URL 발급
 */
export async function getPresignedUploadUrl({
  domain,
  stage,
  extension,
  contentType,
}) {
  const res = await axios.post("/api/s3/presign/upload", {
    domain,
    stage,
    extension,
    contentType,
  });

  return res.data; // { url, key, expiresIn }
}
