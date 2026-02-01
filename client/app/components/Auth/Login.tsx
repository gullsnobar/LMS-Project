"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    AiOutlineEyeInvisible,
    AiOutlineEye,
    AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { styles } from "../../../app/styles/styles";
import { useLoginMutation } from "../../../redux/features/auth/authApi";
import { signIn } from "next-auth/react";

type Props = {
    setRoute: (route: "Login" | "Sign-Up" | "Verification") => void;
    setOpen: (open: boolean) => void;
};

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

const Login = (props: Props) => {
    const { setOpen } = props;
    const [show, setShow] = useState(false);
    const [login, { isSuccess, data, error }] = useLoginMutation();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            login({ email: values.email, password: values.password });
        },
    });


    useEffect(() => {
        if (isSuccess) {
            toast.success("Login Successfully!");
            setOpen(false);
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
    }, [isSuccess, error]);


    const { errors, touched, values, handleSubmit, handleChange } = formik;

    return (
        <div className="w-full">
            <h1 className={`${styles.title}`}>Login With ELearning</h1>
            <form onSubmit={handleSubmit}>
                <label className={`${styles.label}`} htmlFor="email">
                    Enter Your Email
                </label>
                <input
                    type="email"
                    name=""
                    value={values.email}
                    onChange={handleChange}
                    id="email"
                    placeholder="loginemail@gmail.com"
                    className={`${errors.email && touched.email && "border-red-500"} ${styles.input
                        }`}
                />
                {errors.email && touched.email && (
                    <span className="text-red-500 pt-2 block">{errors.email}</span>
                )}
                <div className="w-full mt-5 relative mb-1">
                    <label className={`${styles.label}`} htmlFor="email">
                        Enter Your Password
                    </label>
                    <input
                        type={!show ? "password" : "text"}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        id="password"
                        placeholder="passwords!@#%"
                        className={`${errors.password && touched.password && "border-red-500"
                            } ${styles.input}`}
                    />
                    {!show ? (
                        <AiOutlineEyeInvisible
                            className="absolute bottom-3 right-2 z-1 cursor-pointer"
                            size={20}
                            onClick={() => setShow(true)}
                        />
                    ) : (
                        <AiOutlineEye
                            className="absolute bottom-3 right-2 z-1 cursor-pointer"
                            size={20}
                            onClick={() => setShow(false)}
                        />
                    )}
                    {errors.password && touched.password && (
                        <span className="text-red-500 pt-2 block">{errors.password}</span>
                    )}
                </div>
                <div className="w-full mt-5">
                    <input type="submit" className={`${styles.button}`} />
                </div>
                <br />
                <br />
                <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                    Or Join With
                </h5>
                <div className="flex items-center justify-center my-3 ">
                    <FcGoogle
                        className="cursor-pointer mr-2"
                        size={30}
                        onClick={() => signIn("google")}
                    />
                    <AiFillGithub
                        className="cursor-pointer mr-2"
                        size={30}
                        onClick={() => signIn("github")}
                    />
                </div>
                <h5 className="text-center pt-4 font-Poppins text-[14px]">
                    Not have an account?{" "}
                    <span
                        className="text-[#2190ff] pl-1 cursor-pointer"
                        onClick={() => props.setRoute("Sign-Up")}
                    >
                        Sign Up
                    </span>
                </h5>
            </form>
            <br />
        </div>
    );
};

export default Login;
