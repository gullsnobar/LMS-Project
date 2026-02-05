import { useGetCourseContentQuery } from "../../../redux/features/courses/courseApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "../../utils/Heading";
import CourseContentMedia from "./CourseContentMedia";
import Header from "../Header";
import CourseContentList from "./CourseContentList";
import toast from "react-hot-toast";
type Props = {
    id: string;
    user: any;
};

const CourseContent = ({ id, user }: Props) => {
    const {
        data: contentData,
        isLoading,
        error,
        refetch,
    } = useGetCourseContentQuery(
        { id, userId: user?._id },
        { refetchOnMountOrArgChange: true }
    );
    const [activeVideo, setActiveVideo] = useState(0);
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");
    const data = contentData?.content as any[] | undefined;


    console.log(contentData);
    console.log("getCourseContent error:", error);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Header
                        open={open}
                        setOpen={setOpen}
                        route={route}
                        setRoute={setRoute}
                        activeItem={1}
                    />
                    {error || !Array.isArray(data) || data.length === 0 ? (
                        <div className="w-[92%] 800px:w-[90%] mx-auto py-10">
                            <h2 className="text-[20px] font-Poppins text-black dark:text-white">
                                Unable to load course content
                            </h2>
                            <p className="text-[14px] font-Poppins text-black/70 dark:text-white/70 mt-2">
                                {(() => {
                                    if (error && typeof error === "object" && error && "data" in error) {
                                        const e: any = error;
                                        return e?.data?.message ?? "Please try again.";
                                    }
                                    return "Please try again.";
                                })()}
                            </p>
                        </div>
                    ) : (
                        <div className="w-full grid 800px:grid-cols-10">
                            <Heading
                                title={data[activeVideo]?.title}
                                description="me"
                                keywords={data[activeVideo]?.tags}
                            />
                            <div className="col-span-7">
                                <CourseContentMedia
                                    data={data}
                                    id={id}
                                    user={user}
                                    activeVideo={activeVideo}
                                    setActiveVideo={setActiveVideo}
                                    refetch={refetch}
                                />
                            </div>
                            <div className="hidden 800px:block 800px:col-span-3">
                                <CourseContentList
                                    setActiveVideo={setActiveVideo}
                                    data={data}
                                    activeVideo={activeVideo}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default CourseContent;