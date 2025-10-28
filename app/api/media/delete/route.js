import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import mongoose from "mongoose";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }
    await connectDB();
    const payload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Give Ids Into Array");
    }

    const media = await MediaModel.findOne({ _id: { $in: ids } }).lean();

    if (!media || media.length === 0) {
      return response(false, 400, "Data Not Found");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "Invalid Delete Operation. Delete Type Would Be SD Or RSD For This Route"
      );
    }

    if (deleteType === "SD") {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
    } else {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
    }

    return response(
      true,
      200,
      deleteType === "SD" ? "Data Moved Into Trash" : "Data Restored"
    );
  } catch (error) {
    return catchError(error);
  }
}

export async function DELETE(request) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }
    await connectDB();
    const payload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Give Ids Into Array");
    }

    const media = await MediaModel.find({ _id: { $in: ids } })
      .session(session)
      .lean();

    if (!media || media.length === 0) {
      return response(false, 400, "Deleted Data Not Found");
    }

    if (deleteType !== "PD") {
      return response(
        false,
        400,
        "Invalid Delete Operation. Delete Type Would Be PD For This Route"
      );
    }

    await MediaModel.deleteMany({ _id: { $in: ids } }).session(session);

    // Delete All Matching Data From Cloudinary Also
    const publicIds = media.map((m) => m.public_id);

    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
    }

    await session.commitTransaction();
    session.endSession();

    return response(true, 200, "Data Delete Permanently From Cloudinary");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return catchError(error);
  }
}
