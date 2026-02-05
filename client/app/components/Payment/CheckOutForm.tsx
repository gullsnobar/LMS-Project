import { styles } from "../../styles/styles";
import { useCreateOrderMutation } from "../../../redux/features/orders/orderApi";
import {
    LinkAuthenticationElement,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import socketIO from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedIn } from "../../../redux/features/auth/authSlice";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_URI || "";

type Props = {
    setOpen: any;
    data: any;
    user: any;
    refetch: any
};

const CheckOutForm = ({ data, user, refetch, setOpen }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const dispatch = useDispatch();
    const token = useSelector((state: any) => state.auth.token);
    const socketRef = useRef<ReturnType<typeof socketIO> | null>(null);
    const [message, setMessage] = useState<any>("");
    const [createOrder, { error, data: orderData }] = useCreateOrderMutation({});
    const [isLoading, setIsLoading] = useState(false);

    const courseId = data?._id as string | undefined;
    const courseName = data?.name as string | undefined;
    const userId = user?._id as string | undefined;

    useEffect(() => {
        // Avoid crashing the whole page if socket env isn't configured (common in prod previews).
        if (!ENDPOINT) return;
        const s = socketIO(ENDPOINT, { transports: ["websocket"] });
        socketRef.current = s;
        return () => {
            s.disconnect();
            socketRef.current = null;
        };
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });
        if (error) {
            setMessage(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            setIsLoading(false);
            createOrder({ courseId, payment_info: paymentIntent, userId });
        }
    };
    useEffect(() => {
        if (orderData) {
            // Frontend-only auth: do NOT refetch /me here (it can overwrite state).
            // Instead, update Redux user locally to reflect the newly purchased course.
            if (user && courseId) {
                const existingCourses = Array.isArray(user.courses) ? user.courses : [];
                const alreadyHas = existingCourses.some((item: any) => {
                    const id = item?.courseId ?? item?._id ?? item;
                    return id?.toString?.() === courseId?.toString?.();
                });
                if (!alreadyHas) {
                    dispatch(
                        userLoggedIn({
                            accessToken: token,
                            user: {
                                ...user,
                                courses: [...existingCourses, { courseId }],
                            },
                        })
                    );
                }
            }
            socketRef.current?.emit?.("notification", {
                title: "New Order",
                message: `You Have A New Order From ${courseName ?? "a course"}`,
                userId,
            });
            // Close modal after success
            setOpen(false);
            if (courseId) {
                router.push(`/course-access/${courseId}`);
            } else {
                router.push("/");
            }
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [orderData, error, courseId, courseName, userId, refetch, router]);
    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <LinkAuthenticationElement
                id="link-authentication-element"
            // Access the email value like so:
            // onChange={(event) => {
            //  setEmail(event.value.email);
            // }}
            //
            // Prefill the email field like so:
            // options={{defaultValues: {email: 'foo@bar.com'}}}
            />
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text" className={`${styles.button} mt-2 !h-[35px]`}>
                    {isLoading ? "Paying..." : "Pay Now"}
                </span>
            </button>

            {message && (
                <div id="payment-message" className="text-[red] font-Poppins pt-2">
                    {message}
                </div>
            )}
        </form>
    );
};

export default CheckOutForm;
