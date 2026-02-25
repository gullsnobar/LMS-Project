import { styles } from "../../styles/styles";
import CoursePlayer from "../../utils/CoursePlayer";
import Ratings from "../../utils/Ratings";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "./CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
type Props = {
  data: any;
  clientSecret: string;
  stripePromise: any;
  setOpen: any;
  setRoute: any;
  createPaymentIntentFn: (price: number) => Promise<void> | void;
};
import CheckOutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from "../../../redux/features/api/apiSlice";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useSelector } from "react-redux";

const CourseDetails: FC<Props> = ({
  data,
  stripePromise,
  clientSecret,
  setRoute,
  setOpen: OpenAuthModel,
  createPaymentIntentFn,
}) => {
  const reduxUser = useSelector((state: any) => state.auth.user);
  // Prefer Redux user (loaded in app/layout.tsx); fall back to API if needed.
  const {
    data: userData,
    isLoading: isLoadingUser,
    isFetching: isFetchingUser,
    refetch,
  } = useLoadUserQuery(undefined, { skip: !!reduxUser });
  const [open, setOpen] = useState(false);

  const user = reduxUser || userData?.user;
  const isLoggedIn = !!user && typeof user === "object" && !!user._id;
  //persentage logic
  const discountPercentage =
    ((data?.estimatedPrice - data?.price) / data?.estimatedPrice) * 100;
  //getting only 2-digits after decimal
  const discountPercentagePrice = discountPercentage.toFixed(0);
  //checking weather the user has purchased this course or not
  const isPurchased =
    isLoggedIn &&
    user.courses?.find((item: any) => {
      const courseId = item?.courseId ?? item?._id ?? item;
      return courseId?.toString?.() === data?._id?.toString?.();
    });

  const handleOrder = async () => {
    // If auth is still resolving, try one refetch before deciding.
    if (!user && (isLoadingUser || isFetchingUser)) {
      const res: any = await refetch();
      const refreshedUser = res?.data?.user;
      if (refreshedUser) {
        await createPaymentIntentFn(data.price);
        setOpen(true);
        return;
      }
    }

    if (!isLoggedIn) {
      setRoute("Login");
      OpenAuthModel(true);
      return;
    }

    await createPaymentIntentFn(data.price);
    setOpen(true);
  };

  return (
    <>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          {/*  LEFT SIDE */}
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              {data.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
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
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
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
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
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
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}
            <br />
            <br />
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
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Details
              </h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data.description}
              </p>
            </div>
            <br />
            <br />
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
                      <div className="hidden 800px:block pl-2">
                        <div className="flex items-center">
                          <h5 className="text-[18px] pr-2 text-black dark:text-white">
                            {item.user.name}
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
                    {item.commentReplies.map((i: any, index: number) => (
                      <div className="w-full flex 800px:ml-16 my-5" key={index}>
                        <div className="w-[50px] h-[50px]">
                          <Image
                            src={
                              i.user.avatar
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
                            <h5 className="text-[20px]">{i.user.name}</h5>
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
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <CoursePlayer videoUrl={data.demoUrl} title={data.title} />
              
              {/* Price Section */}
              <div className="mt-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
                <div className="flex items-baseline gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {data.price === 0 ? "Free" : `$${data.price}`}
                  </h1>
                  {data.estimatedPrice > data.price && (
                    <h5 className="text-lg line-through text-gray-400 dark:text-gray-500">
                      ${data.estimatedPrice}
                    </h5>
                  )}
                  {data.estimatedPrice > data.price && (
                    <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold">
                      {discountPercentagePrice}% OFF
                    </span>
                  )}
                </div>

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
                ) : (
                  <button
                    className="mt-4 w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm cursor-pointer"
                    onClick={handleOrder}
                  >
                    {data.price === 0 ? "Enroll for Free" : `Buy Now - $${data.price}`}
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
                    { icon: "📦", text: "Source code included" },
                    { icon: "♾️", text: "Full lifetime access" },
                    { icon: "📜", text: "Certificate of completion" },
                    { icon: "🎧", text: "Premium Support" },
                    { icon: "📱", text: "Access on mobile & desktop" },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <span className="text-sm">{feature.icon}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{feature.text}</span>
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
                    <p className="text-lg font-bold text-gray-900 dark:text-white">${data.price}</p>
                    {data.estimatedPrice > data.price && (
                      <p className="text-xs text-gray-400 line-through">${data.estimatedPrice}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stripe Payment Form */}
              <div className="p-5">
                {stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#667eea", borderRadius: "12px" } } }}>
                    <CheckOutForm setOpen={setOpen} refetch={refetch} data={data} user={user} />
                  </Elements>
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