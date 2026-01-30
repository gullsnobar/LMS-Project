"use client"

import React, {FC, useState} from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";

interface Props {
    
}

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
    return (
        <div>
            <Heading title="ELearning" 
            description="ELearning is a platform for students to learn and get help from teachers" 
            keywords="ELearning, Learning, Education" />

            <Header 
            open={open}
            setOpen={setOpen}
            activeItem={activeItem}
            setRoute={setRoute}
            />

            
        </div>
    )
}

export default Page
