"use client";

import React, { FC } from "react";
import Protected from "../hooks/useProtected";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import { useState } from "react";
import Profile from "@/app/components/Profile/Profile";
import { useSelector } from "react-redux";

type Props = {}

const page: FC<Props> = () => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const [route, setRoute] = useState("Login");
    const { user } = useSelector((state: any) => state.auth);
    return (
        <div>
            <Protected>
                <Heading
                    title={`${user?.name} | ELearning`}
                    description="ELearning is a platform for learning new skills"
                    keywords="Online Learning, Courses, Education, Skills, Development"
                />

                <Header
                    open={open}
                    setOpen={setOpen}
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                />
                <Profile user={user} />
            </Protected>
        </div>
    )
}

export default page;