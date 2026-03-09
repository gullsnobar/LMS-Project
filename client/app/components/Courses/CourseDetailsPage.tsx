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

const CourseDetailsPage: FC<Props> = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { isLoading, data } = useGetCourseDetailsQuery(id);
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
 
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Heading
            title={`${data?.course?.name}-ELearning`}
            description="ELearning is a platform for online learning and education."
            keywords={data?.course?.tags}
          />
          <Header
            route={route}
            open={open}
            setRoute={setRoute}
            setOpen={setOpen}
            activeItem={1}
          />
          {stripePromise && (
            <CourseDetails
              setRoute={setRoute}
              setOpen={setOpen}
              data={data.course}
              stripePromise={stripePromise}
              clientSecret={clientSecret}
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
          )}
          <Footer />
        </>
      )}
    </>
  );
};

export default CourseDetailsPage;