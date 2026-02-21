
import Image from 'next/image';
import { styles } from "../../styles/styles";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

type Props = {}

export const reviews = [
    {
        name: "Gene Bates",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        profession: "Student | Cambridge University",
        rating: 5,
        comment:
            "I recently joined this platform, and I must say it's been an incredible experience. The courses are well-structured, and the instructors are top-notch. Highly recommended!",
    },
    {
        name: "Verna Santos",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        profession: "Full Stack Developer | Quarter ltda",
        rating: 5,
        comment:
            "As a developer, I'm always looking for ways to upskill. This platform offers advanced courses that have helped me stay ahead in my career. The project-based learning approach is fantastic.",
    },
    {
        name: "Jay Henderson",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        profession: "Computer Science Student",
        rating: 5,
        comment:
            "The community here is amazing. Whenever I'm stuck, I get help almost instantly. The collaborative environment makes learning so much more enjoyable.",
    },
];

const Reviews = (props: Props) => {
    return (
        <div className="w-[90%] 800px:w-[85%] m-auto py-20">
            <div className="w-full 800px:flex items-center gap-16">
                {/* Image Section */}
                <div className="800px:w-[50%] w-full mb-10 800px:mb-0 animate-slideInLeft">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                        <Image
                            src="/assetes/bussiness.jpg"
                            alt="Students Success Stories"
                            width={700}
                            height={700}
                            className="w-full object-cover relative z-10 rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="800px:w-[50%] w-full animate-fadeInUp">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                        Our Students Are{" "}
                        <span className="text-gradient">Our Strength</span>
                        <br />
                        <span className="text-2xl md:text-3xl">See What They Say About Us</span>
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 mb-8 leading-relaxed">
                        Join thousands of satisfied students who have transformed their careers with our expert-led courses. Real stories from real people achieving real success.
                    </p>

                    {/* Reviews Cards */}
                    <div className="space-y-6">
                        {reviews &&
                            reviews.map((i, index) => (
                                <div
                                    className="bg-white dark:bg-gray-800/70 border-2 border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm group hover:-translate-y-1 animate-fadeInUp"
                                    key={index}
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    {/* Quote Icon */}
                                    <FaQuoteLeft className="text-blue-600/20 dark:text-blue-400/20 mb-4 group-hover:text-blue-600/40 dark:group-hover:text-blue-400/40 transition-colors" size={32} />

                                    {/* User Info */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="relative">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity" />
                                            <Image
                                                src={i.avatar}
                                                alt={i.name}
                                                width={60}
                                                height={60}
                                                className="relative w-[60px] h-[60px] rounded-full object-cover border-2 border-white dark:border-gray-800"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {i.name}
                                            </h5>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                {i.profession}
                                            </p>
                                            {/* Rating */}
                                            <div className="flex gap-1">
                                                {[...Array(i.rating)].map((_, idx) => (
                                                    <FaStar key={idx} className="text-yellow-500" size={14} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                                        "{i.comment}"
                                    </p>
                                </div>
                            ))}
                    </div>

                    {/* Trust Badge */}
                    <div className="mt-8 inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-6 py-3 rounded-full border border-blue-200 dark:border-blue-800">
                        <FaStar className="text-yellow-500" size={20} />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            4.9/5 Average Rating from 10K+ Reviews
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reviews
