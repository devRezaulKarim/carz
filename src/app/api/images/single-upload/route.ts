// import { auth } from "@/auth";
// import { MAX_IMAGE_SIZE } from "@/config/constants";
// import { uploadToImgBB } from "@/lib/imgbb";
// import { SingleImageUploadSchema } from "@/schemas/images.schema";
// import { forbidden } from "next/navigation";
// import { NextResponse } from "next/server";

// export const POST = auth(async (req) => {
//   if (!req.auth) forbidden();

//   const formData = await req.formData();

//   const { data, success } = SingleImageUploadSchema.safeParse(formData);
//   if (!success) {
//     return NextResponse.json({ message: "Invalid File" }, { status: 400 });
//   }
//   const file = data.file;

//   if (file?.size > MAX_IMAGE_SIZE) {
//     return NextResponse.json({ message: "Invalid file size" }, { status: 400 });
//   }
//   const { default: mimeType } = await import("mime-types");
//   const mime = mimeType.lookup(file.name).toString();
//   if (mime.match(/image\/(jpg|jpeg|png|webp)/) === null) {
//     console.log("File is not an Image");
//     return NextResponse.json(
//       { message: `Invalid file type ${mime}` },
//       { status: 400 },
//     );
//   }

//   try {
//     const imgUrl = await uploadToImgBB(file);

//     if (!imgUrl) {
//       return NextResponse.json({ message: "Upload failed" }, { status: 500 });
//     }
//     return NextResponse.json({ url: imgUrl }, { status: 200 });
//   } catch (error) {
//     console.error("Upload error:", error);
//     if (error instanceof Error) {
//       return NextResponse.json(
//         { message: `Error uploading file ${error.message}` },
//         { status: 400 },
//       );
//     }
//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: 400 },
//     );
//   }
// });
import { auth } from "@/auth";
import { MAX_IMAGE_SIZE } from "@/config/constants";
import { uploadToImgBB } from "@/lib/imgbb";
import { SingleImageUploadSchema } from "@/schemas/images.schema";
import { forbidden } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const session = await auth();
  if (!session) forbidden();

  const formData = await req.formData();

  const { data, success } = SingleImageUploadSchema.safeParse(formData);
  if (!success) {
    return NextResponse.json({ message: "Invalid File" }, { status: 400 });
  }
  const file = data.file;

  if (file?.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ message: "Invalid file size" }, { status: 400 });
  }
  const { default: mimeType } = await import("mime-types");
  const mime = mimeType.lookup(file.name).toString();
  if (mime.match(/image\/(jpg|jpeg|png|webp)/) === null) {
    console.log("File is not an Image");
    return NextResponse.json(
      { message: `Invalid file type ${mime}` },
      { status: 400 },
    );
  }

  try {
    const imgUrl = await uploadToImgBB(file);

    if (!imgUrl) {
      return NextResponse.json({ message: "Upload failed" }, { status: 500 });
    }
    return NextResponse.json({ url: imgUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: `Error uploading file ${error.message}` },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 },
    );
  }
};
