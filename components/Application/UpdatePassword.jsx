"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zSchema } from "@/lib/zodSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoutes";

const UpdatePasswordPage = ({ email }) => {
  const [loading, setLoading] = useState(false);

  const [isTypePassword, setIsTypePassword] = useState(true);
  const router = useRouter();
  const formSchema = zSchema
    .pick({
      email: true,
      password: true,
    })
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Password Not Matched",
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      password: "",
      confirmPassword: "",
    },
  });

  const handlePasswordUpdate = async (values) => {
    console.log(values);
    try {
      setLoading(true);
      const { data: passwordUpdateResponse } = await axios.put(
        `/api/auth/reset-password/update-password`,
        values
      );
      if (!passwordUpdateResponse.success) {
        throw new Error(passwordUpdateResponse.message);
      }
      form.reset();
      // alert(passwordUpdateResponse.message);
      showToast("success", passwordUpdateResponse.message);

      router.push(WEBSITE_LOGIN);
    } catch (error) {
      // alert(error.message);
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="w-[400px]">
      <CardContent>
        <div className="text-center">
          <h1 className="2xl font-semibold">Update Password</h1>
          <p>Create New Password</p>
        </div>

        <div className="mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePasswordUpdate)}>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          // type={isTypePassword ? "password" : "text"}
                          type="password"
                          placeholder="Enter Your Password"
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type={isTypePassword ? "password" : "text"}
                          placeholder="Enter Confirm Password"
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
                  text="Update Password"
                  className="w-full"
                />
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpdatePasswordPage;
