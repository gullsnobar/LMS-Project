
"use client";
import Ratings from "../../utils/Ratings";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { BiDollar } from "react-icons/bi";

type Props = {
  item: any;
  isProfile?: boolean;
  key: number;
};

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  console.log(item);

  const thumbnailUrl =
    item?.thumbnail?.url ||
    "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png";

  return (
    <Link
      href={!isProfile ? `/course/${item._id}` : `course-access/${item._id}`}
      className="block group"
    >
      <div className="w-full h-full bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 card-hover">
        {/* Thumbnail with overlay gradient */}
        <div className="relative w-full h-[240px] overflow-hidden">
          <Image
            width={500}
            height={300}
            src={thumbnailUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Price Badge */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
            <BiDollar size={16} />
            {item.price === 0 ? "Free" : `${item.price}`}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Course Title */}
          <h1 className="font-Poppins text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {item.name}
          </h1>

          {/* Rating and Students */}
          <div className="flex items-center justify-between">
            <Ratings rating={item.ratings} />
            <div
              className={`flex items-center gap-1.5 text-gray-600 dark:text-gray-400 ${
                isProfile && "hidden 800px:flex"
              }`}
            >
              <FaUsers size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">{item.purchased}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* Bottom Section */}
          <div className="flex items-center justify-between">
            {/* Price Info */}
            <div className="flex items-center gap-2">
              {item.price !== 0 && item.estimatedPrice && (
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                  ${item.estimatedPrice}
                </span>
              )}
              {item.estimatedPrice && item.price !== 0 && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full font-semibold">
                  {Math.round((1 - item.price / item.estimatedPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Lectures Count */}
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <AiOutlineUnorderedList size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium">
                {item.courseData?.length || 0} Lectures
              </span>
            </div>
          </div>

          {/* Hover Effect - View Course Button */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-lg font-semibold text-sm shadow-lg">
              View Course Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;