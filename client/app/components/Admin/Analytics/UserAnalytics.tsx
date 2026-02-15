import { useGetUsersAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";
import { FC } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loader from "../../Loader/Loader";
import { styles } from "../../../../app/styles/styles";

type Props = {
  isDashboard?: boolean;
};

const UserAnalytics: FC<Props> = ({ isDashboard }) => {
  const { data, isLoading, error } = useGetUsersAnalyticsQuery({});

  const last12Months =
    data?.users?.last12Months ?? data?.last12Months ?? data?.usersLast12Months ?? [];

  const analyticsData: any[] = [];
  last12Months?.forEach?.((item: any) => {
    analyticsData.push({
      name: item.month,
      count: item.count,
    });
  });

  
  /* // once with dummy data
   const analyticsData = [
     { name: "January 2024", count: 512 },
     { name: "February 2024", count: 7890 },
     { name: "March 2024", count: 3988 },
     { name: "April 2024", count: 4620 },
     { name: "May 2024", count: 2176 },
     { name: "June 2024", count: 3290 },
     { name: "July 2024", count: 488 },
     { name: "August 2024", count: 5932 },
     { name: "September 2024", count: 1435 },
     { name: "October 2024", count: 6720 },
     { name: "November 2024", count: 5301 },
     { name: "December 2024", count: 620 },
   ];
    */

   
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className={`${
            !isDashboard
              ? "mt-[50px]"
              : "mt-[50px] dark:bg-[#111C43] shadow-sm pb-5 rounded-sm"
          }`}
        >
          <div className={`${isDashboard ? "!ml-8 mb-5" : ""}`}>
            <h1
              className={`${styles.title} ${
                isDashboard && "!text-[20px]"
              } px-5 !text-start`}
            >
              Users Analytics
            </h1>
            {!isDashboard && (
              <p className={`${styles.label} px-5`}>
                Last 12 months analytics data
              </p>
            )}
          </div>

          <div
            className={`w-full ${
              isDashboard ? "h-[260px] 800px:h-[30vh]" : "h-[60vh] 800px:h-screen"
            } flex items-center justify-center`}
          >
            {error ? (
              <p className="text-black dark:text-white opacity-80 font-Poppins px-5">
                Failed to load users analytics.
              </p>
            ) : analyticsData.length === 0 ? (
              <p className="text-black dark:text-white opacity-80 font-Poppins px-5">
                No users analytics data available.
              </p>
            ) : (
              <ResponsiveContainer
                width={isDashboard ? "100%" : "90%"}
                height={!isDashboard ? "50%" : "100%"}
              >
                <AreaChart
                  data={analyticsData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <XAxis
                    dataKey="name"
                    height={60}
                    interval="preserveStartEnd"
                    angle={-35}
                    textAnchor="end"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#4d62d9"
                    fill="#4d62d9"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserAnalytics;