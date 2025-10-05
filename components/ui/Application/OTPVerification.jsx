import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ButtonLoading from "./ButtonLoading";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../input-otp";

const OTPVerification = ({ email, onSubmit, loading }) => {
  const formSchema = zSchema.pick({
    otp: true,
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email: email,
    },
  });

  const handleOtpVerification = async (values) => {
    onSubmit(values);
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOtpVerification)}>
          <div className="text-center">
            <h1 className="text-xl text-violet-700 font-bold mb-2">
              Please Complete Your Verification
            </h1>
            <p>We have sent OTP in your email</p>
          </div>
          <div className="mb-3 mt-5 flex justify-center items-center">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-center">
                    One Time Password (OTP)
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot className="text-xl size-10" index={0} />
                        <InputOTPSlot className="text-xl size-10" index={1} />
                        <InputOTPSlot className="text-xl size-10" index={2} />
                        <InputOTPSlot className="text-xl size-10" index={3} />
                        <InputOTPSlot className="text-xl size-10" index={4} />
                        <InputOTPSlot className="text-xl size-10" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-3">
            <ButtonLoading
              loading={loading}
              type="submit"
              text="Vefify"
              className="w-full"
            />
            <div className="text-center mt-5 ">
              <button
                className="text-violet-600 cursor-pointer hover:underline"
                type="submit"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OTPVerification;
