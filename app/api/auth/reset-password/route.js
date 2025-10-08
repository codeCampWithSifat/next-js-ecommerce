import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";

export async function POST(request) {
  try {
    await connectDB();
  } catch (error) {
    return catchError(error);
  }
}
