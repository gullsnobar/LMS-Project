"use client";

import React, { FC, useEffect, useState } from "react";
import axios from "axios";

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoUrl) {
      setLoading(false);
      setError(true);
      return;
    }

    // Fix: use the correct env variable NEXT_PUBLIC_SERVER_URI (not NEXT_PUBLIC_SERVER_URL)
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
    if (!baseUrl) {
      console.error(
        "NEXT_PUBLIC_SERVER_URI is not set. Cannot request VdoCipher OTP."
      );
      setLoading(false);
      setError(true);
      return;
    }

    const url = baseUrl.endsWith("/")
      ? `${baseUrl}getVdoCipherOTP`
      : `${baseUrl}/getVdoCipherOTP`;

    setLoading(true);
    axios
      .post(url, { videoId: videoUrl })
      .then((res) => {
        setVideoData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("VdoCipher OTP API Error:", err?.response?.data || err);
        setLoading(false);
        setError(true);
      });
  }, [videoUrl]);

  if (loading) {
    return (
      <div
        style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}
        className="bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          className="flex items-center justify-center"
        >
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading preview...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !videoData.otp || !videoData.playbackInfo) {
    return (
      <div
        style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl"
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          className="flex items-center justify-center"
        >
          <div className="text-center px-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white font-semibold text-sm">{title || "Course Preview"}</p>
            <p className="text-white/50 text-xs mt-1">Preview not available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}
      className="rounded-xl overflow-hidden"
    >
      <iframe
        src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=cDzWaw5pK6ptF60G`}
        style={{
          border: 0,
          maxWidth: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
        }}
        allowFullScreen={true}
        allow="encrypted-media"
      />
    </div>
  );
};

export default CoursePlayer;