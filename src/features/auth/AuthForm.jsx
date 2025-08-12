import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "./authSlice";
import { FiLoader } from "react-icons/fi";
import { login } from "./authSlice";
import { toast } from "react-hot-toast";

const phoneSchema = z.object({
  countryCode: z.string().min(1, "Select a country code"),
  phone: z
    .string()
    .min(10, "Enter valid phone number")
    .regex(/^\d+$/, "Phone number must contain digits only"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain digits only")
    .optional(),
});

export default function AuthForm() {
  const dispatch = useDispatch();
  const { countries, loadingCountries } = useSelector((state) => state.auth);

  // console.log(countries, loadingCountries);

  const [otpSent, setOtpSent] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(phoneSchema),
  });

  console.log(register);

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const onSubmitPhone = (data) => {
    setLoadingOtp(true);
    // Simulate OTP send
    setTimeout(() => {
      setLoadingOtp(false);
      setOtpSent(true);
      toast.success("OTP sent to " + data.countryCode + " " + data.phone);
    }, 3000);
  };

  const onSubmitOtp = (data) => {
    // Simulate OTP validation
    setLoadingOtp(true);

    setTimeout(() => {
      dispatch(login(data));
      console.log(data);

      setLoadingOtp(false);
      toast.success("OTP Verified. Logged in!");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      {loadingCountries ? (
        <div className="flex items-center justify-center p-6">
          <FiLoader className="animate-spin text-primary text-4xl" />
          <span className="ml-3 text-lg font-semibold text-primary">
            Loading...
          </span>
        </div>
      ) : (
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 text-center text-primary">
              Login / Signup
            </h2>

            {!otpSent ? (
              <form
                onSubmit={handleSubmit(onSubmitPhone)}
                className="space-y-4"
              >
                {/* Country Code + Phone Number */}
                <div className="flex gap-2">
                  <select
                    {...register("countryCode")}
                    className="select select-bordered w-1/3"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Code
                    </option>
                    {loadingCountries ? (
                      <option disabled>Loading...</option>
                    ) : (
                      countries.map((c) => (
                        <option key={c.code} value={c.dialCodes}>
                          {c.name} ({c.dialCodes})
                        </option>
                      ))
                    )}
                  </select>

                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="Phone Number"
                    className="input input-bordered flex-1"
                  />
                </div>

                {errors.countryCode && (
                  <p className="text-error text-sm">
                    {errors.countryCode.message}
                  </p>
                )}
                {errors.phone && (
                  <p className="text-error text-sm">{errors.phone.message}</p>
                )}

                <button
                  type="submit"
                  className={`btn btn-primary w-full ${
                    loadingOtp ? "loading" : ""
                  }`}
                  disabled={loadingOtp}
                >
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit(onSubmitOtp)} className="space-y-4">
                <input
                  type="text"
                  {...register("otp")}
                  placeholder="Enter OTP"
                  className="input input-bordered w-full text-center text-xl tracking-widest"
                  maxLength={6}
                  autoFocus
                />

                {errors.otp && (
                  <p className="text-error text-sm">{errors.otp.message}</p>
                )}

                <button
                  type="submit"
                  className={`btn btn-primary w-full ${
                    loadingOtp ? "loading" : ""
                  }`}
                  disabled={loadingOtp}
                >
                  Verify OTP
                </button>

                <button
                  type="button"
                  className="btn btn-ghost btn-sm w-full"
                  onClick={() => setOtpSent(false)}
                >
                  Back
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
