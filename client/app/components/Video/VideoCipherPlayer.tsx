import React, { FC, useEffect, useState } from "react";
import { useGetVdoCipherOtpMutation } from "../../../redux/features/courses/courseApi";

type Props = {
  courseId: string;
  className?: string;
};

const VideoCipherPlayer: FC<Props> = ({ courseId, className }) => {
  const [videoData, setVideoData] = useState({ otp: "", playbackInfo: "" });
  const [getVdoCipherOtp, { isLoading, error }] = useGetVdoCipherOtpMutation();

  useEffect(() => {
    if (courseId) {
      getVdoCipherOtp(courseId)
        .unwrap()
        .then((res) => {
          if (res.success) {
            setVideoData({
              otp: res.otp,
              playbackInfo: res.playbackInfo,
            });
          }
        })
        .catch((err) => {
          console.error("Failed to fetch VideoCipher OTP", err);
        });
    }
  }, [courseId, getVdoCipherOtp]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg shadow-lg ${className || 'w-full h-full'}`}>
        <p className="text-gray-500 dark:text-gray-400">Loading secure video...</p>
      </div>
    );
  }

  if (error || !videoData.otp) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg ${className || 'w-full h-full'}`}>
        <p className="text-red-500">Failed to load video</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className || 'w-full'}`} style={{ paddingTop: "56.25%" }}>
      <iframe
        src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=vdo`}
        className="absolute top-0 left-0 w-full h-full border-0 rounded-lg shadow-lg"
        allowFullScreen={true}
        allow="encrypted-media"
      />
    </div>
  );
};

export default VideoCipherPlayer;
