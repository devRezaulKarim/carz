export async function uploadToImgBB(file: File): Promise<string | null> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      console.error("Missing ImgBB API key");
      return null;
    }

    // Generate a unique file name using timestamp
    const fileName = `${decodeURIComponent(file.name).split(".")[0]}-${Date.now()}`;

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        key: apiKey,
        image: base64Image,
        name: fileName,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      return null;
    }
    return result.data.url;
  } catch (error) {
    throw error;
  }
}
