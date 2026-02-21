import { styles } from "@/app/styles/styles";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

// Fallback FAQ questions for when API data is not available
const fallbackFAQ = [
    {
        _id: "1",
        question: "What courses do you offer?",
        answer: "We offer a wide range of courses including Web Development, Mobile App Development, Data Science, Machine Learning, UI/UX Design, Cloud Computing, and many more. Our courses are designed by industry experts and updated regularly to keep up with the latest trends and technologies."
    },
    {
        _id: "2",
        question: "How do I enroll in a course?",
        answer: "Enrolling is simple! Just create an account, browse our course catalog, select the course you're interested in, and click the 'Enroll Now' button. You can pay securely using credit/debit cards, PayPal, or other supported payment methods."
    },
    {
        _id: "3",
        question: "Do I get a certificate after completing a course?",
        answer: "Yes! Upon successful completion of any course, you will receive a verified certificate that you can share on LinkedIn, add to your resume, or showcase to potential employers. Our certificates are recognized by top companies worldwide."
    },
    {
        _id: "4",
        question: "Can I access the courses on mobile devices?",
        answer: "Absolutely! Our platform is fully responsive and works seamlessly on all devices including smartphones, tablets, laptops, and desktop computers. You can also download course materials for offline viewing through our mobile app."
    },
    {
        _id: "5",
        question: "What is your refund policy?",
        answer: "We offer a 30-day money-back guarantee on all our courses. If you're not satisfied with a course for any reason, you can request a full refund within 30 days of purchase. No questions asked!"
    },
    {
        _id: "6",
        question: "Do you offer any free courses?",
        answer: "Yes, we have a selection of free courses available for beginners. These courses cover fundamental concepts and are a great way to get started with learning. You can also preview paid courses before purchasing."
    },
    {
        _id: "7",
        question: "How long do I have access to a course?",
        answer: "Once you enroll in a course, you have lifetime access to all its content. This means you can learn at your own pace and revisit the material whenever you need a refresher."
    },
    {
        _id: "8",
        question: "Is there any support available if I get stuck?",
        answer: "Yes! We have a dedicated support team and an active community forum where you can ask questions and get help. Additionally, many courses have Q&A sections where instructors respond to student queries."
    }
];

const FAQ = () => {
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [questions, setQuestions] = useState<any[]>(fallbackFAQ);
    const { data } = useGetHeroDataQuery("FAQ", {
        refetchOnMountOrArgChange: true,
    });
    
    useEffect(() => {
        if (data?.layout?.faq && data.layout.faq.length > 0) {
            setQuestions(data.layout.faq);
        }
    }, [data]);
    
    const toggleQuestion = (id: any) => {
        setActiveQuestion(activeQuestion === id ? null : id);
    };

    return (
        <div className="w-[90%] 800px:w-[85%] m-auto py-12">
            {/* Section Header */}
            <div className="text-center mb-12 animate-fadeInUp">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Frequently Asked <span className="text-gradient">Questions</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Find answers to common questions about our platform and courses
                </p>
            </div>

            {/* FAQ Accordion */}
            <div className="max-w-4xl mx-auto">
                <dl className="space-y-4">
                    {questions.map((q: any, index: number) => (
                        <div
                            key={q._id}
                            className="group animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div
                                className={`border-2 rounded-xl transition-all duration-300 ${
                                    activeQuestion === q._id
                                        ? 'border-blue-600 dark:border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-lg'
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-purple-400 dark:hover:border-purple-600'
                                }`}
                            >
                                <dt>
                                    <button
                                        className="flex items-start justify-between w-full text-left p-6 focus:outline-none"
                                        onClick={() => toggleQuestion(q._id)}
                                    >
                                        <span className="font-semibold text-lg text-gray-900 dark:text-white pr-6">
                                            {q.question}
                                        </span>
                                        <span
                                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                activeQuestion === q._id
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                                    : 'bg-gray-200 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'
                                            }`}
                                        >
                                            {activeQuestion === q._id ? (
                                                <HiMinus className="h-5 w-5 text-white" />
                                            ) : (
                                                <HiPlus className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                            )}
                                        </span>
                                    </button>
                                </dt>
                                {activeQuestion === q._id && (
                                    <dd className="px-6 pb-6 pt-0 animate-fadeInUp">
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                                                {q.answer}
                                            </p>
                                        </div>
                                    </dd>
                                )}
                            </div>
                        </div>
                    ))}
                </dl>
            </div>

            {/* Contact CTA */}
            <div className="mt-16 text-center animate-fadeInUp">
                <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Still have questions?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Can't find the answer you're looking for? Please reach out to our support team.
                    </p>
                    <a
                        href="mailto:support@elearning.com"
                        className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;