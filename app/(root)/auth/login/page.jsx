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
import ButtonLoading from "@/components/ui/Application/ButtonLoading";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import Link from "next/link";
import { WEBSITE_REGISTER } from "@/routes/WebsiteRoutes";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/ui/Application/OTPVerification";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);

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
      const { data: registerResponse } = await axios.post(
        `/api/auth/login`,
        values
      );
      if (!registerResponse.success) {
        throw new Error(registerResponse.message);
      }
      setOtpEmail(values.email);
      form.reset();
      // alert(registerResponse.message);
      showToast("success", registerResponse.message);
    } catch (error) {
      // alert(error.message);
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Otp Verification
  const handleOtpVerification = async () => {
    try {
      setOtpVerificationLoading(true);
      const { data: registerResponse } = await axios.post(
        `/api/auth/verify-otp`,
        values
      );
      if (!registerResponse.success) {
        throw new Error(registerResponse.message);
      }
      setOtpEmail("");
      // alert(registerResponse.message);
      showToast("success", registerResponse.message);
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
                      <Link href="" className="text-primary underline">
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
