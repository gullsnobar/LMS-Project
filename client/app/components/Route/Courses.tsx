import { useGetUsersAllCoursesQuery } from "../../../redux/features/courses/courseApi";
import React, { useEffect, useState } from "react";
import CourseCard from "../Courses/CourseCard";
import Loader from "../Loader/Loader";
import { FaGraduationCap } from "react-icons/fa";
import Link from "next/link";

// Demo courses to show when no API data is available
const demoCourses = [
    {
        _id: "demo1",
        name: "Complete Web Development Bootcamp 2024",
        description: "Learn HTML, CSS, JavaScript, React, Node.js, and more to become a full-stack web developer.",
        price: 49.99,
        estimatedPrice: 199.99,
        thumbnail: { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500" },
        ratings: 4.8,
        purchased: 15420,
        courseData: Array(42).fill({}),
        categories: "Web Development"
    },
    {
        _id: "demo2",
        name: "Python for Data Science & Machine Learning",
        description: "Master Python programming, data analysis, visualization, and machine learning algorithms.",
        price: 59.99,
        estimatedPrice: 249.99,
        thumbnail: { url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500" },
        ratings: 4.9,
        purchased: 12350,
        courseData: Array(58).fill({}),
        categories: "Data Science"
    },
    {
        _id: "demo3",
        name: "React & Next.js - The Complete Guide",
        description: "Build modern, blazing-fast web applications with React 18 and Next.js 14.",
        price: 44.99,
        estimatedPrice: 179.99,
        thumbnail: { url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500" },
        ratings: 4.7,
        purchased: 9870,
        courseData: Array(36).fill({}),
        categories: "Web Development"
    },
    {
        _id: "demo4",
        name: "AWS Cloud Practitioner Certification",
        description: "Prepare for the AWS Cloud Practitioner exam with hands-on labs and practice tests.",
        price: 39.99,
        estimatedPrice: 149.99,
        thumbnail: { url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500" },
        ratings: 4.6,
        purchased: 7650,
        courseData: Array(28).fill({}),
        categories: "Cloud Computing"
    },
    {
        _id: "demo5",
        name: "UI/UX Design Masterclass",
        description: "Learn user interface and user experience design from scratch using Figma and Adobe XD.",
        price: 34.99,
        estimatedPrice: 139.99,
        thumbnail: { url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500" },
        ratings: 4.8,
        purchased: 8920,
        courseData: Array(32).fill({}),
        categories: "Design"
    },
    {
        _id: "demo6",
        name: "Node.js & Express - Backend Development",
        description: "Build scalable REST APIs and backend services with Node.js, Express, and MongoDB.",
        price: 54.99,
        estimatedPrice: 199.99,
        thumbnail: { url: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500" },
        ratings: 4.7,
        purchased: 6540,
        courseData: Array(45).fill({}),
        categories: "Web Development"
    },
    {
        _id: "demo7",
        name: "Mobile App Development with React Native",
        description: "Create cross-platform mobile apps for iOS and Android using React Native.",
        price: 64.99,
        estimatedPrice: 229.99,
        thumbnail: { url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500" },
        ratings: 4.5,
        purchased: 5430,
        courseData: Array(38).fill({}),
        categories: "Mobile Development"
    },
    {
        _id: "demo8",
        name: "Docker & Kubernetes - DevOps Essentials",
        description: "Master containerization and orchestration for modern application deployment.",
        price: 49.99,
        estimatedPrice: 189.99,
        thumbnail: { url: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=500" },
        ratings: 4.9,
        purchased: 4320,
        courseData: Array(34).fill({}),
        categories: "DevOps"
    }
];

const Courses = () => {
    const { data, isLoading } = useGetUsersAllCoursesQuery({});
    
    // Use API courses or fallback to demo courses
    const courses = (data?.courses && data.courses.length > 0) ? data.courses : demoCourses;

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
                    <div className="w-[90%] 800px:w-[80%] m-auto">
                        {/* Section Header */}
                        <div className="text-center mb-16 animate-fadeInUp">
                            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full border border-blue-200 dark:border-blue-800">
                                <FaGraduationCap className="text-blue-600 dark:text-blue-400" size={20} />
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    {courses.length}+ Premium Courses
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                                Expand Your Career{" "}
                                <span className="text-gradient">Opportunities</span>
                                <br className="hidden sm:block" />
                                <span className="text-3xl md:text-4xl lg:text-5xl">With Our Courses</span>
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                                Discover a wide range of courses designed by industry experts to help you achieve your goals
                            </p>
                        </div>

                        {/* Courses Grid */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 1500px:grid-cols-4 mb-12">
                            {courses &&
                                courses.map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        className="animate-fadeInUp"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <CourseCard item={item} key={index} />
                                    </div>
                                ))}
                        </div>

                        {/* View All Courses Button */}
                        <div className="text-center mt-8">
                            <Link
                                href="/courses"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                View All Courses
                                <span className="text-xl">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Courses;