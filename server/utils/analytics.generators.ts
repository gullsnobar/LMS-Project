import { Document, Model } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

export async function generateLast12MonthsData<T extends Document>(
  model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
  const last12Months: MonthData[] = [];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // original logic: shift 1 day forward

  for (let i = 11; i >= 0; i--) {
    // Calculate end date for this "month" (28-day period)
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28
    );
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 28);

    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    last12Months.push({
      month: endDate.toLocaleString("default", { month: "short" }),
      count,
    });
  }

  return { last12Months };
}
