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
  USER_DASHBOARD,
  WEBSITE_REGISTER,
  WEBSITE_RESETPASSWORD,
} from "@/routes/WebsiteRoutes";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/Application/OTPVerification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isTypePassword, setIsTypePassword] = useState(true);
  const [otpEmail, setOtpEmail] = useState();

  const formSchema = zSchema
    .pick({
      email: true,
      password: true,
    })
    .extend({
      password: z.string().min(5, "Password Field is Required"),
    });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: loginResponse } = await axios.post(
        `/api/auth/login`,
        values
      );
      if (!loginResponse.success) {
        throw new Error(loginResponse.message);
      }
      setOtpEmail(values.email);
      form.reset();
      // alert(loginResponse.message);
      showToast("success", loginResponse.message);
    } catch (error) {
      // alert(error.message);
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Otp Verification
  const handleOtpVerification = async (values) => {
    try {
      setOtpVerificationLoading(true);
      const { data: otpResponse } = await axios.post(
        `/api/auth/verify-otp`,
        values
      );
      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }
      setOtpEmail("");
      // alert(otpResponse.message);
      showToast("success", otpResponse.message);

      dispatch(login(otpResponse.data));
      if (searchParams.has("callback")) {
        router.push(searchParams.get("callback"));
      } else {
        otpResponse.data.role === "admin"
          ? router.push(ADMIN_DASHBOARD)
          : router.push(USER_DASHBOARD);
      }
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
              <h1 className="2xl font-semibold">Login Into Account</h1>
              <p>Login Into Your Account By Filling This Form</p>
            </div>

            <div className="mt-5">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
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
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type={isTypePassword ? "password" : "text"}
                              placeholder="Enter Your Password"
                              {...field}
                            />
                          </FormControl>
                          <button
                            className="absolute top-1/2 right-2 cursor-pointer"
                            type="button"
                            onClick={() => setIsTypePassword(!isTypePassword)}
                          >
                            {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                          </button>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <ButtonLoading
                      loading={loading}
                      type="submit"
                      text="Login"
                      className="w-full"
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center items-center gap-2 ">
                      <p>Don't Have Account </p>
                      <Link
                        href={WEBSITE_REGISTER}
                        className="text-primary underline"
                      >
                        Create Account
                      </Link>
                    </div>
                    <div className="mt-3">
                      <Link
                        href={WEBSITE_RESETPASSWORD}
                        className="text-primary underline"
                      >
                        Forget Password
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <>
            <OTPVerification
              email={otpEmail}
              onSubmit={handleOtpVerification}
              loading={otpVerificationLoading}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginPage;
