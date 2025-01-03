import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "../components/index";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);

  const signUp = async (data) => {
    setError(null);
    try {
      const createSession = await authService.createAccount(data); //i'm going to get authservice and creat an account in sign up session.
      if (createSession) {
        const userData = await authService.getCurrentUser(); //if i'm getting it here, time to update the store
        if (userData) {
          dispatch(login({ userData })); // Pass userData explicitly //once userData has been passed to the store from this part, forcefully navigate to the root.
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message || "An error occurred while signing up.");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(signUp)}>
          <div className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Enter your fullname"
              type="text"
              {...register("name", {
                required: true,
              })}
            />
            <Input
              label="email"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            <Button type="submit" className="w-full">
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
