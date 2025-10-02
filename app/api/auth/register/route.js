import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

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
  } catch (error) {}
}
