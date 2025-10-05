import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendEmail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { z } from "zod";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();
    const validationSchema = zSchema
      .pick({
        email: true,
      })
      .extend({
        password: z.string(),
      });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(false, 401, "Invalid Missing Input", validatedData.error);
    }

    const { email, password } = validatedData.data;

    // Get user data
    const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
      "+password"
    );
    if (!getUser) {
      return response(false, 400, "Invalid Email");
    }

    // Is Email Not Verified Send Verification Mail Again

    if (!getUser.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      const token = await new SignJWT({ userId: getUser._id.toString() })
        .setIssuedAt()
        .setExpirationTime("24h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      await sendMail(
        "Email Verification Request",
        email,
        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
        )
      );

      return response(
        false,
        401,
        "Your Email Is Not Verified. We Send A Verification Link In Your Email"
      );
    }

    // Password Checking
    const isPasswordVerified = await getUser.comparePassword(password);
    if (!isPasswordVerified) {
      return response(false, 400, "Invalid Password");
    }

    // OTP Generation
    await OTPModel.deleteMany({ email });

    const otp = generateOTP();
    // Storing Otp into database
    const newOtpData = new OTPModel({
      email,
      otp,
    });

    await newOtpData.save();
    // send otp to the user
    const otpEmailStatus = await sendMail(
      "Your One Time Passsword",
      email,
      otpEmail(otp)
    );
    if (!otpEmailStatus.success) {
      return response(false, 400, "Failed To Send OTP");
    }
    return response(true, 200, "Please Verify Your Device");
  } catch (error) {
    return catchError(error);
  }
}
