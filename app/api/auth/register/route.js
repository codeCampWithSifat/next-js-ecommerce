import { connectDB } from "@/lib/databaseConnection";

export async function POST(request) {
  try {
    await connectDB();
  } catch (error) {}
}
