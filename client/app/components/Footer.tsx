import Link from "next/link";
import { FaGithub, FaInstagram, FaYoutube, FaTwitter, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black border-t-2 border-gray-200 dark:border-gray-800 mt-20">
      <div className="w-[95%] 800px:w-full 800px:max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
          {/* About Section */}
          <div className="space-y-4 animate-fadeInUp">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ELearning
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Empowering learners worldwide with quality education and expert-led courses.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://github.com/alishair7071"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
              >
                <FaGithub className="text-white" size={18} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
              >
                <FaInstagram className="text-white" size={18} />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
              >
                <FaYoutube className="text-white" size={18} />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
              >
                <FaTwitter className="text-white" size={18} />
              </a>
            </div>
          </div>

          {/* About Links */}
          <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              About
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                  href="/about"
                >
                  <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-300"></span>
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                  href="/policy"
                >
                  <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                  href="/faq"
                >
                  <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-300"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                  href="/about"
                >
                  <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-300"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 group"
                  href="/courses"
                >
                  <span className="w-0 h-0.5 bg-purple-600 group-hover:w-4 transition-all duration-300"></span>
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 group"
                  href="/profile"
                >
                  <span className="w-0 h-0.5 bg-purple-600 group-hover:w-4 transition-all duration-300"></span>
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 group"
                  href="/courses"
                >
                  <span className="w-0 h-0.5 bg-purple-600 group-hover:w-4 transition-all duration-300"></span>
                  Become Instructor
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 group"
                  href="/about"
                >
                  <span className="w-0 h-0.5 bg-purple-600 group-hover:w-4 transition-all duration-300"></span>
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Stay Connected
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Subscribe to our newsletter for the latest courses, tips, and exclusive offers.
            </p>
            <a
              href="mailto:alishair7071@gmail.com"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <MdEmail size={20} />
              Get in Touch
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-300 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Copyright © 2025 <span className="font-semibold text-gradient">ELearning</span>. All Rights Reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Terms
              </Link>
              <Link href="/policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Privacy
              </Link>
              <Link href="/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;