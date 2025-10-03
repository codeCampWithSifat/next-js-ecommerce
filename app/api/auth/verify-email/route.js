import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import { jwtVerify } from "jose";

export async function POST(request) {
  try {
    await connectDB();
    const token = await request.json();
    // const token = body.token;
    if (!token) {
      return response(false, 400, "Missing Token");
    }
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const decoded = await jwtVerify(token, secret);
    const userId = decoded.payload?.userId;
    console.log("userId", decoded);

    if (!isValidObjectId(userId)) {
      return response(false, 400, "Invalid User Id", userId);
    }
    // Get User
    const user = await UserModel.findById(userId);
    if (!user) {
      return response(false, 404, "User Not Found");
    }
    user.isEmailVerified = true;
    await user.save();
    return response(true, 200, "Email Verified Successfully");
  } catch (error) {
    return catchError(error);
  }
}
