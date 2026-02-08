"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState, FormEvent, ChangeEvent } from "react";
import { BiSearch } from "react-icons/bi";

type Props = object;

const Hero: FC<Props> = () => {
    const [search, setSearch] = useState("");
    const router = useRouter();

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (search.trim() === "") {
            return;
        }
        router.push(`/courses?title=${encodeURIComponent(search)}`);
    };

    return (
        <div className="w-full min-h-[calc(100vh-80px)] flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 lg:px-16 py-12 lg:py-0 relative overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Animated background circles */}
            <div className="absolute top-[50px] left-[50px] w-[350px] h-[350px] lg:w-[600px] lg:h-[600px] hero_animation rounded-full opacity-30 blur-3xl" />
            <div className="absolute bottom-[100px] right-[50px] w-[200px] h-[200px] lg:w-[400px] lg:h-[400px] bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl" />

            {/* Hero banner Image */}
            <div className="lg:w-1/2 flex items-center justify-center z-10 mb-10 lg:mb-0">
                <div className="relative">
                    {/* Glow effect behind image */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-30 scale-110" />
                    <Image
                        src="/assetes/hero-banner-1.png"
                        width={500}
                        height={500}
                        alt="Hero Banner - Online Learning Platform"
                        className="object-contain w-full max-w-[350px] lg:max-w-[500px] h-auto relative z-10 drop-shadow-2xl animate-float"
                        priority
                    />
                </div>
            </div>

            {/* Hero content section */}
            <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full border border-blue-200 dark:border-blue-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        40K+ Online Courses Available
                    </span>
                </div>

                {/* Main headline */}
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    Improve Your{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Online Learning
                    </span>{" "}
                    Experience Better Instantly
                </h1>

                {/* Subtitle or description */}
                <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-lg leading-relaxed">
                    We have 40k+ online courses & 500K+ registered students. Find your
                    desired courses from them and start learning today.
                </p>

                {/* Search form */}
                <form onSubmit={handleSearch} className="w-full max-w-lg mb-8">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
                        <div className="relative flex items-center">
                            <input
                                value={search}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setSearch(e.target.value)
                                }
                                type="search"
                                placeholder="Search Courses..."
                                className="w-full h-12 px-5 pr-14 text-base text-gray-700 bg-white dark:bg-gray-800 dark:text-white border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 h-9 w-9 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                            >
                                <BiSearch className="text-white" size={20} />
                            </button>
                        </div>
                    </div>
                </form>

                {/* Trust indicators - client avatars and text */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="flex -space-x-3">
                        <Image
                            src="/assetes/client-1.jpg"
                            alt="Happy Student"
                            width={48}
                            height={48}
                            className="rounded-full border-2 border-white dark:border-gray-800 shadow-md"
                        />
                        <Image
                            src="/assetes/client-2.jpg"
                            alt="Happy Student"
                            width={48}
                            height={48}
                            className="rounded-full border-2 border-white dark:border-gray-800 shadow-md"
                        />
                        <Image
                            src="/assetes/client-3.jpg"
                            alt="Happy Student"
                            width={48}
                            height={48}
                            className="rounded-full border-2 border-white dark:border-gray-800 shadow-md"
                        />
                        <div className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                            +5K
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-sm text-gray-900 dark:text-white font-semibold">
                            500K+ People already trusted us
                        </p>
                        <Link
                            href="/courses"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200 flex items-center gap-1"
                        >
                            View Courses
                            <span className="text-base">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;