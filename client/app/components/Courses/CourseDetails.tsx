import { styles } from "../../styles/styles";
import CoursePlayer from "../../utils/CoursePlayer";
import VideoCipherPlayer from "../Video/VideoCipherPlayer";
import Ratings from "../../utils/Ratings";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "./CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from "../../../redux/features/api/apiSlice";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { userLoggedIn } from "../../../redux/features/auth/authSlice";
import io from "socket.io-client"; // FIX #3: static import instead of require()

type Props = {
  data: any;
  clientSecret: string;
  stripePromise: any;
  setOpen: any;
  setRoute: any;
  createPaymentIntentFn: (price: number) => Promise<void> | void;
  onApplyCoupon: (code: string) => Promise<void>;
  onRemoveCoupon: () => void;
  appliedCoupon: any;
  couponError: any;
  couponLoading: boolean;
  onFreeEnroll: () => Promise<void>;
  freeEnrollData: any;
  freeEnrollError: any;
  freeEnrollLoading: boolean;
};

const CourseDetails: FC<Props> = ({
  data,
  stripePromise,
  clientSecret,
  setRoute,
  setOpen: OpenAuthModel,
  createPaymentIntentFn,
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon,
  couponError,
  couponLoading,
  onFreeEnroll,
  freeEnrollData,
  freeEnrollError,
  freeEnrollLoading,
}) => {
  const reduxUser = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const dispatch = useDispatch();
  const router = useRouter();
  // Prefer Redux user (loaded in app/layout.tsx); fall back to API if needed.
  const {
    data: userData,
    isLoading: isLoadingUser,
    isFetching: isFetchingUser,
    refetch,
  } = useLoadUserQuery(undefined, { skip: !!reduxUser });
  const [open, setOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const user = reduxUser || userData?.user;
  const isLoggedIn = !!user && typeof user === "object" && !!user._id;
  //persentage logic
  // FIX #1: guard against estimatedPrice being 0/undefined so we don't render "NaN% OFF"
  const hasValidEstimatedPrice =
    typeof data?.estimatedPrice === "number" &&
    data.estimatedPrice > 0 &&
    typeof data?.price === "number" &&
    data.estimatedPrice > data.price;
  const discountPercentage = hasValidEstimatedPrice
    ? ((data.estimatedPrice - data.price) / data.estimatedPrice) * 100
    : 0;
  //getting only 2-digits after decimal
  const discountPercentagePrice = discountPercentage.toFixed(0);
  //checking weather the user has purchased this course or not
  const isPurchased =
    isLoggedIn &&
    user.courses?.find((item: any) => {
      const courseId = item?.courseId ?? item?._id ?? item;
      return courseId?.toString?.() === data?._id?.toString?.();
    });

  // Calculate display price considering coupon
  const displayPrice = appliedCoupon?.finalPrice ?? data.price;

  // Handle free enrollment success
  useEffect(() => {
    if (freeEnrollData?.success) {
      toast.success("Successfully enrolled in the course!");

      // FIX #3: use the statically-imported `io`, guard against a missing/blank
      // socket URI, and don't disconnect on a blind timeout — disconnect once
      // the emit has actually been acknowledged (or the connection fails).
      const socketUri = process.env.NEXT_PUBLIC_SOCKET_URI;
      if (socketUri) {
        const socket = io(socketUri, { transports: ["websocket"] });
        socket.on("connect", () => {
          socket.emit("notification", {
            title: "New Enrollment",
            message: `A user has enrolled in ${data?.name || "a free course"}`,
            userId: user?._id,
          });
          socket.disconnect();
        });
        socket.on("connect_error", () => {
          socket.disconnect();
        });
      }

      // Update Redux state
      if (user && data?._id) {
        const existingCourses = Array.isArray(user.courses) ? user.courses : [];
        dispatch(
          userLoggedIn({
            accessToken: token,
            user: {
              ...user,
              courses: [...existingCourses, { courseId: data._id }],
            },
          })
        );
      }
      router.push(`/course-access/${data._id}`);
    }
    if (freeEnrollError) {
      const errMsg = (freeEnrollError as any)?.data?.message || "Failed to enroll";
      toast.error(errMsg);
    }
    // FIX #4: include everything the effect actually reads
  }, [freeEnrollData, freeEnrollError, data, user, token, dispatch, router]);

  // Handle coupon error
  useEffect(() => {
    if (couponError) {
      const errMsg = (couponError as any)?.data?.message || "Invalid coupon";
      toast.error(errMsg);
    }
  }, [couponError]);

  const handleOrder = async () => {
    // If auth is still resolving, try one refetch before deciding.
    if (!user && (isLoadingUser || isFetchingUser)) {
      const res: any = await refetch();
      const refreshedUser = res?.data?.user;
      if (refreshedUser) {
        await createPaymentIntentFn(displayPrice);
        setOpen(true);
        return;
      }
    }

    if (!isLoggedIn) {
      setRoute("Login");
      OpenAuthModel(true);
      return;
    }

    await createPaymentIntentFn(displayPrice);
    setOpen(true);
  };

  const handleFreeEnrollment = async () => {
    if (!isLoggedIn) {
      setRoute("Login");
      OpenAuthModel(true);
      return;
    }
    await onFreeEnroll();
  };

  return (
    <>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5 pt-[100px]">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          {/*  LEFT SIDE */}
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-3xl font-bold font-Poppins text-black dark:text-white mb-2">
              {data.name}
            </h1>
            <div className="flex items-center justify-between pt-3 pb-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <Ratings rating={data.ratings} />
                <h5 className="text-black dark:text-white">
                  {data.reviews?.length} Reviews
                </h5>
              </div>
              <h5 className="text-black dark:text-white">
                {data.purchased} Students
              </h5>
            </div>
            <br />
            {/* Each benefits  */}
            <h1 className="text-2xl font-bold font-Poppins text-black dark:text-white mb-4">
              What you will learn from this course?
            </h1>
            <div>
              {data.benefits?.map((item: any, index: number) => (
                <div
                  className="w-full flex 800px:items-center py-2"
                  key={index}
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <br />
            <br />
            {/* Each prerequisite */}
            <h1 className="text-2xl font-bold font-Poppins text-black dark:text-white mb-4">
              What are the prerequisites for starting this course?
            </h1>
            {data.prerequisites?.map((item: any, index: number) => (
              <div className="w-full flex 800px:items-center py-2" key={index}>
                <div className="w-[15px] mr-1">
                  <IoCheckmarkDoneOutline
                    size={20}
                    className="text-black dark:text-white"
                  />
                </div>
                <p className="pl-2 text-black dark:text-white">{item.title || item}</p>
              </div>
            ))}
            <br />
            <br />

            {/* Target Audience */}
            {data.targetAudience && data.targetAudience.length > 0 && (
              <>
                <h1 className="text-2xl font-bold font-Poppins text-black dark:text-white mb-4">
                  Target Audience
                </h1>
                {data.targetAudience.map((item: any, index: number) => (
                  <div className="w-full flex 800px:items-center py-2" key={index}>
                    <div className="w-[15px] mr-1">
                      <IoCheckmarkDoneOutline size={20} className="text-black dark:text-white" />
                    </div>
                    <p className="pl-2 text-black dark:text-white">{item.title || item}</p>
                  </div>
                ))}
                <br />
                <br />
              </>
            )}

            <div>
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Overview
              </h1>
              <CourseContentList data={data?.courseData} isDemo={true} />
              {/* Course Content List */}
            </div>
            <br />
            <br />
            {/* Course Discryption */}

            <div className="w-full">
              <h1 className="text-2xl font-bold font-Poppins text-black dark:text-white mb-4">
                Course Description
              </h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data.description}
              </p>
            </div>
            <br />
            <br />

            {/* Instructor Section */}
            {data.instructor && (
              <div className="w-full mb-8">
                <h1 className="text-2xl font-bold font-Poppins text-black dark:text-white mb-4">
                  About the Instructor
                </h1>
                <div className="flex items-start gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="w-[80px] h-[80px] rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={data.instructor.photo || "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                      alt={data.instructor.name || "Instructor"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {data.instructor.name || "Course Instructor"}
                    </h2>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                      {data.instructor.designation || "Senior Software Engineer"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {data.instructor.bio || "Passionate about building scalable web applications and teaching development best practices to students worldwide."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* REVIEWS */}
            <div className="w-full">
              <div className="800px:flex items-center ">
                <Ratings rating={data.ratings} />
                <div className="mb-2 800px:mb-[unset]" />
                <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                  {Number.isInteger(data?.ratings)
                    ? data?.ratings.toFixed(1)
                    : data?.ratings.toFixed(2)}
                  Course Rating • {data?.reviews?.length} Reviews
                </h5>
              </div>
              <br />
              {data?.reviews &&
                [...data.reviews].reverse().map((item: any, index: number) => (
                  <div className="w-full pb-4" key={index}>
                    {/* Review item */}
                    <div className="flex">
                      <div className="w-[50px] h-[50px]">
                        <Image
                          src={
                            item.user?.avatar
                              ? item.user.avatar.url
                              : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                      </div>
                      <div className="block pl-2">
                        <div className="flex items-center">
                          {/* FIX #6: optional chaining + fallback for a possibly-missing user */}
                          <h5 className="text-[18px] pr-2 text-black dark:text-white">
                            {item.user?.name || "Anonymous"}
                          </h5>
                          <Ratings rating={item.rating} />
                        </div>
                        <p className="text-black dark:text-white">
                          {item.comment}
                        </p>
                        <small className="text-[#000000d1] dark:text-[#ffffff83]">
                          {format(item.createdAt)} •
                        </small>
                      </div>
                    </div>
                    {/* Replies */}

                    {/* Comment Replies */}
                    {/* FIX #2 & #7: guard the array itself and each reply's user object */}
                    {(item.commentReplies ?? []).map((i: any, index: number) => (
                      <div className="w-full flex 800px:ml-16 my-5" key={index}>
                        <div className="w-[50px] h-[50px]">
                          <Image
                            src={
                              i.user?.avatar
                                ? i.user.avatar.url
                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>
                        <div className="pl-2">
                          <div className="flex items-center">
                            <h5 className="text-[20px]">{i.user?.name || "Anonymous"}</h5>
                            <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                          </div>
                          <p>{i.comment}</p>
                          <small className="text-[#ffffff83]">
                            {format(i.createdAt)} •
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
          {/* Right Side */}
          <div className="w-full 800px:w-[35%] relative">
            {/* Fixed position on scroll  stays in view */}
            <div className="sticky top-[90px] left-0 z-50 w-full">
              {/* Demo courses: show thumbnail — don't call VdoCipher API (fake ID = 500 error) */}
              {data._id?.startsWith("demo") ? (
                <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingTop: "56.25%" }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    {data.thumbnail?.url ? (
                      <img
                        src={data.thumbnail.url}
                        alt={data.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                      />
                    ) : null}
                    <div className="relative text-center px-4 z-10">
                      <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                        <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-white font-semibold text-sm">Demo Preview</p>
                      <p className="text-white/50 text-xs mt-1">Add a real course to see video</p>
                    </div>
                  </div>
                </div>
              ) : (
                <VideoCipherPlayer courseId={data._id} />
              )}

              {/* Price Section */}
              <div className="mt-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
                <div className="flex items-baseline gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {data.price === 0 ? "Free" : `$${displayPrice}`}
                  </h1>
                  {appliedCoupon && (
                    <h5 className="text-lg line-through text-gray-400 dark:text-gray-500">
                      ${data.price}
                    </h5>
                  )}
                  {!appliedCoupon && hasValidEstimatedPrice && (
                    <h5 className="text-lg line-through text-gray-400 dark:text-gray-500">
                      ${data.estimatedPrice}
                    </h5>
                  )}
                  {hasValidEstimatedPrice && !appliedCoupon && (
                    <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold">
                      {discountPercentagePrice}% OFF
                    </span>
                  )}
                  {appliedCoupon && (
                    <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-bold">
                      COUPON APPLIED
                    </span>
                  )}
                </div>

                {/* Coupon Applied Badge */}
                {appliedCoupon && (
                  <div className="mt-2 mb-3 flex items-center justify-between p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        {appliedCoupon.coupon.code} — Save ${appliedCoupon.discountAmount.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onRemoveCoupon();
                        setCouponCode("");
                      }}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                    >
                      <IoCloseOutline size={18} />
                    </button>
                  </div>
                )}

                {/* Coupon Input (only for paid courses the user hasn't bought) */}
                {!isPurchased && data.price > 0 && !appliedCoupon && (
                  <div className="mt-3 mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <button
                        onClick={() => onApplyCoupon(couponCode)}
                        disabled={!couponCode || couponLoading}
                        className="px-4 py-2 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Buy or enter button depending on purchase */}
                {isPurchased ? (
                  <Link
                    className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                    href={`/course-access/${data._id}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Continue Learning
                  </Link>
                ) : data.price === 0 ? (
                  <button
                    className="mt-4 w-full py-3.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleFreeEnrollment}
                    disabled={freeEnrollLoading}
                  >
                    {freeEnrollLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enrolling...
                      </span>
                    ) : (
                      "Enroll for Free"
                    )}
                  </button>
                ) : (
                  <button
                    className="mt-4 w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm cursor-pointer"
                    onClick={handleOrder}
                  >
                    Buy Now - ${displayPrice}
                  </button>
                )}

                {/* 30-Day Guarantee */}
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
                  30-Day Money-Back Guarantee
                </p>

                {/* Course features */}
                <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2.5">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">This course includes:</h4>
                  {[
                    "Source code included",
                    "Full lifetime access",
                    "Certificate of completion",
                    "Premium Support",
                    "Access on mobile & desktop",
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        {open && (
          <div className="w-full h-screen bg-black/60 backdrop-blur-sm fixed top-0 left-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800">
              {/* Payment Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Complete Payment
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Secure checkout powered by Stripe
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <IoCloseOutline size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Order Summary */}
              <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-11 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                    {data.thumbnail?.url ? (
                      <img src={data.thumbnail.url} alt={data.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{data.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{data.level || "All Levels"}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">${displayPrice}</p>
                    {appliedCoupon && (
                      <p className="text-xs text-gray-400 line-through">${data.price}</p>
                    )}
                    {!appliedCoupon && hasValidEstimatedPrice && (
                      <p className="text-xs text-gray-400 line-through">${data.estimatedPrice}</p>
                    )}
                  </div>
                </div>

                {/* Coupon Discount Summary in Modal */}
                {appliedCoupon && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                      <span className="text-gray-700 dark:text-gray-300">${data.price}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-green-600 dark:text-green-400">
                        Coupon ({appliedCoupon.coupon.code})
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        -${appliedCoupon.discountAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-gray-900 dark:text-white">${displayPrice}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stripe Payment Form */}
              <div className="p-5">
                {stripePromise && clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#667eea", borderRadius: "12px" } } }}>
                    <CheckOutForm
                      setOpen={setOpen}
                      refetch={refetch}
                      data={{ ...data, price: displayPrice }}
                      user={user}
                      couponCode={appliedCoupon?.coupon?.code}
                    />
                  </Elements>
                ) : data.price > 0 && !isPurchased && (
                  <div className="text-center py-4">
                    <p className="text-sm text-red-500 font-semibold">Payment system is currently unavailable.</p>
                    <p className="text-xs text-gray-500 mt-1">Please contact support or try again later.</p>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="px-5 pb-5">
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Stripe Powered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default CourseDetails;