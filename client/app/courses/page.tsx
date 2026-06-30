"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader/Loader";
import Headings from "../utils/Heading";
import { useGetUsersAllCoursesQuery } from "../../redux/features/courses/courseApi";
import { useGetHeroDataQuery } from "../../redux/features/layout/layoutApi";
import { styles } from "../styles/styles";
import CourseCard from "../components/Courses/CourseCard";
import Footer from "../components/Footer";
import { FaGraduationCap, FaSearch } from "react-icons/fa";
/* eslint-disable @typescript-eslint/no-explicit-any */

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

// Demo categories
const demoCategories = [
    { title: "Web Development" },
    { title: "Data Science" },
    { title: "Cloud Computing" },
    { title: "Design" },
    { title: "Mobile Development" },
    { title: "DevOps" }
];

const CoursesContent = () => {
    const searchParams = useSearchParams();
    const searchTerm = searchParams?.get("title");
    const { data, isLoading, isError } = useGetUsersAllCoursesQuery({});
    const { data: categories } = useGetHeroDataQuery("Categories", {});
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState("All");
    
    // Use API categories or fallback to demo categories
    const layoutCategories = categories?.layout?.categories?.length > 0 
        ? categories.layout.categories 
        : demoCategories;

    const apiCourses: any[] = data?.courses ?? data?.course ?? [];
    const isApiAvailable = apiCourses.length > 0;

    // Distinguish: server truly offline (isError) vs server online but DB empty (!isApiAvailable)
    const isServerOffline = !isLoading && isError;
    const isDbEmpty = !isLoading && !isError && !isApiAvailable;
    const isDemo = !isLoading && !isApiAvailable; // show demo cards in both cases

    // Show real courses if available, else demo previews
    const allCourses = isApiAvailable ? apiCourses : demoCourses;

    const courses = (allCourses as any[]).filter((item: any) => {
        const matchesSearch = searchTerm ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        const matchesCategory = category === "All" ? true : item.categories?.toLowerCase() === category.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (<>
                <Header route={route}
                    setRoute={setRoute}
                    open={open}
                    setOpen={setOpen}
                    activeItem={1}
                />
                <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh] py-8">
                    <Headings
                        title={"All courses - LMS"}
                        description={"LMS is a programming community."}
                        keywords={
                            "programming community, coding skills, expert insights, collaboration, growth"
                        }
                    />
                    
                    {/* Page Header */}
                    <div className="text-center mb-12 animate-fadeInUp">
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full border border-blue-200 dark:border-blue-800">
                            <FaGraduationCap className="text-blue-600 dark:text-blue-400" size={20} />
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                {allCourses.length}+ Premium Courses
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Explore Our <span className="text-gradient">Courses</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Discover world-class courses designed to help you achieve your goals
                        </p>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        <button
                            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                                category === "All" 
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30" 
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                            }`}
                            onClick={() => setCategory("All")}
                        >
                            All Courses
                        </button>
                        {layoutCategories &&
                            layoutCategories.map((item: any, index: number) => (
                                <button
                                    key={index}
                                    className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                                        category === item.title
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                                    }`}
                                    onClick={() => setCategory(item.title)}
                                >
                                    {item.title}
                                </button>
                            ))}
                    </div>

                    {/* No Courses Found State */}
                    {courses && courses.length === 0 && (
                        <div className="text-center py-20 animate-fadeInUp">
                            <div className="inline-block p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                                <FaSearch className="text-blue-600 dark:text-blue-400 mx-auto mb-4" size={48} />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    No Courses Found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {searchTerm
                                        ? `No courses match "${searchTerm}"`
                                        : "No courses found in this category"}
                                </p>
                                <button
                                    onClick={() => setCategory("All")}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                >
                                    View All Courses
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Banner 1: Server truly unreachable (network error / CORS) */}
                    {isServerOffline && (
                        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M12 12h.01M6.343 17.657a9 9 0 010-12.728" />
                            </svg>
                            <div>
                                <p className="font-semibold text-red-800 dark:text-red-300 text-sm">Cannot reach backend server</p>
                                <p className="text-red-700 dark:text-red-400 text-xs mt-0.5">
                                    Make sure your backend is running: <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">cd server &amp;&amp; npm run dev</code>. Showing demo previews below — <strong>click any card</strong> to preview the course page layout.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Banner 2: Server connected but no courses in DB yet */}
                    {isDbEmpty && (
                        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="font-semibold text-blue-800 dark:text-blue-300 text-sm">No courses in database yet</p>
                                <p className="text-blue-700 dark:text-blue-400 text-xs mt-0.5">
                                    Your server is connected ✓ but no courses have been added. Go to <strong>Admin Panel → Create Course</strong> to add real courses. Meanwhile, <strong>click any preview card below</strong> to see the full course page layout.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Course Grid */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 1500px:grid-cols-4 mb-12">
                        {!isLoading && courses &&
                            courses.map((item: any, index: number) => (
                                <div
                                    key={item._id || index}
                                    className="animate-fadeInUp"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <CourseCard item={item} key={index} isDemo={isDemo} />
                                </div>
                            ))}
                    </div>

                </div>
                <Footer />
            </>
            )}
        </>
    );
};

const Page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <CoursesContent />
        </Suspense>
    );
};

export default Page;