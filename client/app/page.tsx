"use client";

import React, { FC } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";

interface Props { }

const Page: FC<Props> = () => {
    return (
        <div>
            <Heading
                title="ELearning"
                description="ELearning is a platform for students to learn and get help from teachers"
                keywords="ELearning, Learning, Education"
            />

            <Header />

            <Hero />
        </div>
    );
};

export default Page;
