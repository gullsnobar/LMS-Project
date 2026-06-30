import { useGetCourseDetailsQuery } from "../../../redux/features/courses/courseApi";
import React, { FC, useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "../../utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
import { loadStripe } from "@stripe/stripe-js";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishAbleKeyQuery,
  useApplyCouponMutation,
  useEnrollFreeCourseMutation,
} from "../../../redux/features/orders/orderApi";

type Props = {
  id: string;
};

// ─── Demo course mock data (shown when DB is empty / ID starts with "demo") ───
const DEMO_COURSES: Record<string, any> = {
  demo1: {
    _id: "demo1",
    name: "Complete Web Development Bootcamp 2024",
    description:
      "Unlock the full potential of full-stack development by building a professional-grade Learning Management System (LMS) from the ground up. This course is designed for developers who want to master the MERN stack (MongoDB, Express.js, React, Node.js) integrated with the modern features of Next.js.\n\nYou will go from absolute beginner to building production-ready applications with real authentication, payments, video streaming, and more.",
    price: 49,
    estimatedPrice: 80,
    ratings: 4.0,
    purchased: 1,
    tags: "web development, html, css, javascript",
    level: "Beginner",
    demoUrl: "",
    freePreviewEnabled: false,
    thumbnail: { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500", public_id: "demo" },
    benefits: [
      { title: "Build a production-ready, full-stack Learning Management System (LMS) from scratch." },
      { title: "Master the integration of MongoDB, Express.js, React, and Next.js." },
      { title: "Implement secure authentication with JWT and refresh tokens." },
      { title: "Integrate Stripe for payment processing and VdoCipher for video streaming." },
    ],
    prerequisites: [
      { title: "Fundamental knowledge of JavaScript (ES6+)." },
      { title: "Basic understanding of React and the MERN stack." },
    ],
    courseData: [
      { videoSection: "Backend Foundations & Database Design", title: "Setting up Express & MongoDB", videoLength: 15, _id: "cd1" },
      { videoSection: "Backend Foundations & Database Design", title: "User Authentication with JWT", videoLength: 20, _id: "cd2" },
      { videoSection: "Frontend with React & Next.js", title: "Building the Course Listing Page", videoLength: 18, _id: "cd3" },
      { videoSection: "Frontend with React & Next.js", title: "Course Detail Page & Stripe Integration", videoLength: 25, _id: "cd4" },
    ],
    reviews: [
      {
        user: { name: "Qasim Ahmad", avatar: { url: "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png" } },
        rating: 4,
        comment: "Coool!!",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        commentReplies: [],
      },
      {
        user: { name: "Qasim Ahmad", avatar: { url: "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png" } },
        rating: 4,
        comment: "Coool!!",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        commentReplies: [],
      },
    ],
    instructor: {
      name: "Demo Instructor",
      designation: "Senior Full-Stack Engineer",
      bio: "Passionate about building scalable web applications and teaching development best practices to students worldwide.",
      photo: "",
    },
  },
};

// Generate other demo courses based on demo1 with slight variation
["demo2","demo3","demo4","demo5","demo6","demo7","demo8"].forEach((id, i) => {
  const names = [
    "Python for Data Science & Machine Learning",
    "React & Next.js – The Complete Guide",
    "AWS Cloud Practitioner Certification",
    "UI/UX Design Masterclass",
    "Node.js & Express – Backend Development",
    "Mobile App Development with React Native",
    "Docker & Kubernetes – DevOps Essentials",
  ];
  const prices = [59, 44, 39, 34, 54, 64, 49];
  const estimated = [80, 80, 80, 80, 80, 80, 80];
  DEMO_COURSES[id] = {
    ...DEMO_COURSES["demo1"],
    _id: id,
    name: names[i],
    price: prices[i],
    estimatedPrice: estimated[i],
  };
});

// ─────────────────────────────────────────────────────────────────────────────

const CourseDetailsPage: FC<Props> = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  // Check if this is a demo course (DB is empty, user clicked a preview card)
  const isDemoId = id.startsWith("demo");
  const demoCourse = isDemoId ? DEMO_COURSES[id] ?? DEMO_COURSES["demo1"] : null;

  const { isLoading, data } = useGetCourseDetailsQuery(id, { skip: isDemoId });

  //get stripe key
  const { data: config } = useGetStripePublishAbleKeyQuery({});
  //recive client secret by passing amount
  const [
    createPaymentIntent,
    { data: paymentIntentdata, error: paymentIntentError },
  ] = useCreatePaymentIntentMutation({});
  const [applyCoupon, { data: couponData, error: couponError, isLoading: couponLoading }] =
    useApplyCouponMutation();
  const [enrollFreeCourse, { data: freeEnrollData, error: freeEnrollError, isLoading: freeEnrollLoading }] =
    useEnrollFreeCourseMutation();
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
 
  useEffect(() => {
    if (config) {
      const publishableKey = config?.publishableKey;
      setStripePromise(loadStripe(publishableKey));
    }   
  }, [config]);
  
  useEffect(() => {
    if (paymentIntentdata) {
      setClientSecret(paymentIntentdata.client_secret);
    }
  }, [paymentIntentdata]);

  useEffect(() => {
    if (paymentIntentError) {
      console.log("Error while creating payment intent:", paymentIntentError);
    }
  }, [paymentIntentError]);

  useEffect(() => {
    if (couponData?.success) {
      setAppliedCoupon(couponData);
    }
  }, [couponData]);

  // Handle applying a coupon
  const handleApplyCoupon = async (couponCode: string) => {
    if (!couponCode) return;
    setAppliedCoupon(null);
    await applyCoupon({ code: couponCode, courseId: id });
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Free course enrollment handler
  const handleFreeEnroll = async () => {
    await enrollFreeCourse({ courseId: id });
  };

  // Trigger payment intent creation when the user actually wants to buy
  const handleCreatePaymentIntent = async (price: number) => {
    if (!price || price <= 0) {
      console.error("Invalid price passed to handleCreatePaymentIntent:", price);
      return;
    }

    const amount = Math.round(price * 100);

    try {
      await createPaymentIntent({
        amount,
        courseId: id,
        couponCode: appliedCoupon?.coupon?.code || undefined,
      });
    } catch (error) {
      console.error("Failed to create payment intent:", error);
    }
  };

  // ── Resolve the course to render ──────────────────────────────────────────
  const courseData = isDemoId ? demoCourse : data?.course;

  return (
    <>
      {/* Demo Banner */}
      {isDemoId && (
        <div className="w-full bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-700 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-amber-800 dark:text-amber-300 text-sm font-medium">
              You are viewing a <strong>demo preview</strong>. Add real courses via the Admin panel to see live data.
            </p>
          </div>
          <a
            href="/courses"
            className="text-xs text-amber-700 dark:text-amber-400 underline hover:no-underline flex-shrink-0 ml-4"
          >
            ← Back to Courses
          </a>
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : !courseData ? (
        <div className="flex flex-col justify-center items-center h-screen gap-6 px-4">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
              The course you&apos;re looking for doesn&apos;t exist or may have been removed.
              Make sure your backend server is running and the course ID is correct.
            </p>
          </div>
          <a
            href="/courses"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            ← Browse All Courses
          </a>
        </div>
      ) : (
        <>
          <Heading
            title={`${courseData?.name} - ELearning`}
            description="ELearning is a platform for online learning and education."
            keywords={courseData?.tags}
          />
          <Header
            route={route}
            open={open}
            setRoute={setRoute}
            setOpen={setOpen}
            activeItem={1}
          />
          <CourseDetails
            setRoute={setRoute}
            setOpen={setOpen}
            data={courseData}
            stripePromise={isDemoId ? null : stripePromise}
            clientSecret={isDemoId ? "" : clientSecret}
            createPaymentIntentFn={handleCreatePaymentIntent}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            appliedCoupon={appliedCoupon}
            couponError={couponError}
            couponLoading={couponLoading}
            onFreeEnroll={handleFreeEnroll}
            freeEnrollData={freeEnrollData}
            freeEnrollError={freeEnrollError}
            freeEnrollLoading={freeEnrollLoading}
          />
          <Footer />
        </>
      )}
    </>
  );
};

export default CourseDetailsPage;