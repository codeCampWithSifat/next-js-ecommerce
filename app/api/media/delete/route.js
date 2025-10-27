import { catchError, isAuthenticated } from "@/lib/helperFunction";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
    }
  } catch (error) {
    return catchError(error);
  }
}
