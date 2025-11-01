import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }
    await connectDB();

    const getParams = await params;
    const id = getParams.id;
    const filter = {
      deletedAt: null,
    };

    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid Object Id");
    }

    filter._id = id;
    const getMedia = await MediaModel.findOne(filter).lean();

    if (!getMedia) {
      return response(false, 404, "Media Data Not Found");
    }

    return response(true, 200, "Media Data Found", getMedia);
  } catch (error) {
    return catchError(error);
  }
}
