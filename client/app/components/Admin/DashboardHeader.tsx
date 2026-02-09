import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "../../../redux/features/notifications/notificationsApi";
import { ThemeSwitcher } from "../../utils/ThemeSwitcher";
import { FC, useEffect, useRef, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
const ENDPOINT =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URI ||
  process.env.NEXT_PUBLIC_SOCKET_URI ||
  "/";
import socketIO from "socket.io-client";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });


type Props = {
  open?: boolean;
  setOpen?: any;
};
import { format } from "timeago.js";
const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [
    updateNotificationStatus,
    { isSuccess },
  ] = useUpdateNotificationStatusMutation();


  const [audio] = useState(new Audio(
    "https://res.cloudinary.com/dasdrngo1/video/upload/v1715355770/notifications/mixkit-bubble-pop-up-alert-notification-2357_wbwviv.wav"
  ));

  const playerNotificationSound = () => {
    // autoplay can be blocked until the user interacts; avoid unhandled promise rejections
    audio.play().catch(() => {});
  }

  useEffect(() => {
    if (data) {
      const unread = (data.notifications || [])
        .filter((item: any) => item.status === "unread")
        .slice()
        .sort(
          (a: any, b: any) =>
            new Date(b?.createdAt || 0).getTime() -
            new Date(a?.createdAt || 0).getTime()
        );
      setNotifications(unread);
    }
    if (isSuccess) {
      refetch();
    }
    audio.load();
  }, [data, isSuccess, refetch]);

  useEffect(() => {
    const onNewNotification = (payload: any) => {
      if (payload) {
        refetch();
      }
      playerNotificationSound();
    };

    socketId.on("newNotification", onNewNotification);
    return () => {
      socketId.off("newNotification", onNewNotification);
    };
  }, [refetch, audio]);


  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
  };


  /* 
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(
        "https://res.cloudinary.com/dasdrngo1/video/upload/v1715355770/notifications/mixkit-bubble-pop-up-alert-notification-2357_wbwviv.wav"
      );
    }
  }, []);
  */
  /*
    const playNotificationSound = () => {
      audioRef.current?.play().catch((err) => {
        console.error("Error Audio Playing: ", err);
      });
    };
    /*
    When notification data is available, store only the unread ones in state.Also, if a notification status was updated successfully, refetch the list. 
    
  
    
  Set up a socket listener for real-time "newNotification" events from the server. When a new notification arrives, it refetches the notification list and plays a sound.
  */



  // Close dropdown when clicking outside
  /*useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  */
  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0 z-[9999]">
      <ThemeSwitcher />
      {/* Notification bell icon */}
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer text-black dark:text-white" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-5 h-5 text-[12px] flex items-center justify-center text-white">
          {notifications && notifications.length}
        </span>
      </div>
      {/* Notification dropdown - shown only if `open` is true */}
      {open && (
        <div
          className="w-[350px] max-h-[60vh] dark:bg-[#111C43] bg-white shadow-2xl absolute top-16 right-2 z-[10000] rounded overflow-hidden border border-[#00000014] dark:border-[#ffffff1a]"
        >
          {/* Sticky header */}
          <div className="sticky top-0 z-10 dark:bg-[#111C43] bg-white border-b border-[#00000014] dark:border-[#ffffff1a]">
            <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
              Notifications
            </h5>
          </div>

          {/* Scrollable list */}
          <div className="max-h-[calc(60vh-56px)] overflow-y-auto">
            {notifications && notifications.length === 0 ? (
              <p className="p-4 font-Poppins text-black dark:text-white opacity-80 text-center">
                No new notifications
              </p>
            ) : (
              notifications?.map((item: any, index: number) => (
                <div
                  key={item?._id || index}
                  className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]"
                >
                  <div className="w-full flex items-center justify-between gap-3 p-2">
                    <p className="text-black dark:text-white font-[600] truncate">
                      {item.title}
                    </p>
                    <button
                      type="button"
                      className="text-black dark:text-white cursor-pointer whitespace-nowrap text-[14px] underline underline-offset-2"
                      onClick={() => handleNotificationStatusChange(item._id)}
                    >
                      Mark as read
                    </button>
                  </div>
                  <p className="px-2 pb-1 text-black dark:text-white">
                    {item.message}
                  </p>
                  <p className="p-2 text-black dark:text-white text-[14px] opacity-80">
                    {format(item.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};



export default DashboardHeader;