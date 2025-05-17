// src/api/medivault.js

// 1. Request a presigned S3 URL from Lambda
export async function getPresignedUrl(fileName, fileType) {
    console.log("Requesting presigned URL for:", fileName, "with type:", fileType);
  
    const res = await fetch("https://anqte0gyu0.execute-api.ap-south-1.amazonaws.com/getPresignedUrl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, fileType }),
    });
  
    if (!res.ok) {
      throw new Error("Failed to get presigned URL");
    }
  
    const data = await res.json();
    console.log("Received signed URL:", data.url);
    return data.url;
  }
  
  // 2. Upload file directly to S3 using the signed URL
  export async function uploadFileToS3(file, url) {
    const contentType = file.type || "application/octet-stream";
  
    console.log("Uploading file:", file.name);
    console.log("With Content-Type:", contentType);
  
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: file,
    });
  
    if (!res.ok) {
      console.error("Upload failed with status:", res.status);
    }
  
    return res.ok;
  }
  
  
  // 3. Save metadata to DynamoDB via Lambda
  export async function saveMetadataToDynamo(metadata) {
    console.log("Saving metadata:", metadata);
  
    const res = await fetch("https://anqte0gyu0.execute-api.ap-south-1.amazonaws.com/uploadReport", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadata),
    });
  
    if (!res.ok) {
      console.error("Failed to save metadata:", res.status);
      throw new Error("Failed to save metadata to DynamoDB");
    }
  
    const data = await res.json();
    return data;
  }
  
  // 4. NEW: Fetch all reports from DynamoDB via GET Lambda
  // 4. Updated: Fetch reports for a specific user via POST
export async function getReports(userEmail) {
  console.log("Fetching reports for:", userEmail);

  const res = await fetch(
    `https://anqte0gyu0.execute-api.ap-south-1.amazonaws.com/get?userEmail=${encodeURIComponent(userEmail)}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch reports");
  }

  const data = await res.json();
  return data;
}


  
  // 5. NEW: Delete a report by ID (or fileUrl if needed)
  export async function deleteReport(reportId, fileName) {
    console.log("Deleting report with ID:", reportId, "and file:", fileName);
  
    const res = await fetch("https://anqte0gyu0.execute-api.ap-south-1.amazonaws.com/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, fileName }), // ✅ send both
    });
  
    if (!res.ok) {
      console.error("Delete failed:", res.status);
      throw new Error("Failed to delete report");
    }
  
    const data = await res.json();
    return data;
  }
  
  