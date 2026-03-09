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
    refetch: any;
    couponCode?: string;
};

const CheckOutForm = ({ data, user, refetch, setOpen, couponCode }: Props) => {
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
            createOrder({ courseId, payment_info: paymentIntent, userId, couponCode });
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
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
                <LinkAuthenticationElement
                    id="link-authentication-element"
                    options={{
                        defaultValues: {
                            email: user?.email || "",
                        },
                    }}
                />
                <PaymentElement
                    id="payment-element"
                    options={{
                        layout: "tabs",
                    }}
                />
            </div>
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing Payment...
                    </span>
                ) : (
                    `Pay $${(data?.price || 0).toFixed(2)}`
                )}
            </button>

            {message && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {message}
                </div>
            )}
        </form>
    );
};

export default CheckOutForm;
