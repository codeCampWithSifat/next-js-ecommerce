import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendEmail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();
    const validationSchema = zSchema.pick({
      email: true,
    });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(false, 401, "Invalid Input", validatedData.error);
    }

    const { email } = validatedData.data;

    const getUser = await UserModel.findOne({ deletedAT: null, email }).lean();
    if (!getUser) {
      return response(false, 404, "User Not Found");
    }

    // remove old otp from database
    await OTPModel.deleteMany({ email });
    const otp = generateOTP();
    const newOtpData = new OTPModel({
      email,
      otp,
    });

    await newOtpData.save();

    const otpSendStatus = await sendMail(
      "Your Login Verification Code",
      email,
      otpEmail(otp)
    );

    if (!otpSendStatus.success) {
      return response(false, 400, "Failed To Resend OTP");
    }

    return response(true, 200, "Verify Your Account");
  } catch (error) {
    return catchError(error);
  }
}
