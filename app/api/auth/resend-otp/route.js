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
    const validatadData = validationSchema.safeParse(payload);

    if (!validatadData.success) {
      return response(
        false,
        401,
        "Invalid Email For Resend Email",
        validatadData.error
      );
    }

    const { email } = validatadData.data;

    const getUser = await UserModel.findOne({ email });
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

    return response(true, 200, "OTP Send Successfully");
  } catch (error) {
    return catchError(error);
  }
}
