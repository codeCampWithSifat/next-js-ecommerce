"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import Logo from "../../../../public/assets/images/logo-black.png";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { email, z } from "zod";
import { useForm } from "react-hook-form";
import { zSchema } from "@/lib/zodSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import Link from "next/link";
import {
  WEBSITE_LOGIN,
  WEBSITE_REGISTER,
  WEBSITE_RESETPASSWORD,
} from "@/routes/WebsiteRoutes";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/Application/OTPVerification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import UpdatePasswordPage from "@/components/Application/UpdatePassword";

const ResetPasswordPage = () => {
  const [emailVerificationLoading, setEmailVerificationLoading] =
    useState(false);

  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);

  const [otpEmail, setOtpEmail] = useState();
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const formSchema = zSchema.pick({
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleEmailVerification = async (values) => {
    try {
      setEmailVerificationLoading(true);
      const { data: sendOtpResponse } = await axios.post(
        `/api/auth/reset-password/send-otp`,
        values
      );
      if (!sendOtpResponse.success) {
        throw new Error(sendOtpResponse.message);
      }
      setOtpEmail(values.email);
      // alert(sendOtpResponse.message);
      showToast("success", sendOtpResponse.message);
    } catch (error) {
      // alert(error.message);
      showToast("error", error.message);
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  const handleOtpVerification = async (values) => {
    try {
      setOtpVerificationLoading(true);
      const { data: otpResendResponse } = await axios.post(
        `/api/auth/reset-password/verify-otp`,
        values
      );
      if (!otpResendResponse.success) {
        throw new Error(otpResendResponse.message);
      }
      // alert(otpResendResponse.message);
      showToast("success", otpResendResponse.message);
      setIsOtpVerified(true);
    } catch (error) {
      // alert(error.message);
      showToast("error", error.message);
    } finally {
      setOtpVerificationLoading(false);
    }
  };
  return (
    <Card className="w-[400px]">
      <CardContent>
        <div className="flex justify-center">
          <Image
            src={Logo.src}
            width={Logo.width}
            height={Logo.height}
            alt="Logo"
            className="max-w-[150px]"
          />
        </div>

        {!otpEmail ? (
          <>
            <div className="text-center">
              <h1 className="2xl font-semibold">Reset Password</h1>
              <p>Enter Your Email For Password Reset</p>
            </div>

            <div className="mt-5">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEmailVerification)}>
                  <div className="mb-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@gmail.com"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <ButtonLoading
                      loading={emailVerificationLoading}
                      type="submit"
                      text="Send OTP"
                      className="w-full"
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center items-center gap-2 ">
                      <Link
                        href={WEBSITE_LOGIN}
                        className="text-primary underline"
                      >
                        Back To Login
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <>
            {!isOtpVerified ? (
              <OTPVerification
                email={otpEmail}
                onSubmit={handleOtpVerification}
                loading={otpVerificationLoading}
              />
            ) : (
              <UpdatePasswordPage email={otpEmail} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
