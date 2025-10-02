import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    await connectDB();
    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await request.json();
    const validatadData = validationSchema.safeParse(payload);

    if (!validatadData.success) {
      return response(
        false,
        401,
        "Invalid or missing input fields",
        validatadData.error
      );
    }

    const { name, email, password } = validatadData.data;
    const checkUser = await UserModel.exists({ email });

    if (checkUser) {
      return response(true, 409, "User Already Registered");
    }

    // new Registration
    const newRegistration = new UserModel({
      name,
      email,
      password,
    });

    await newRegistration.save();

    const secret = new TextEncoder.encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: newRegistration._id })
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);
  } catch (error) {}
}
