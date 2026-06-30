"use client";
import { use } from "react";
import CourseDetailsPage from "../../components/Courses/CourseDetailsPage";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Page = ({ params }: Props) => {
  const { id } = use(params); 

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <CourseDetailsPage id={id} />
    </div>
  );
};

export default Page;