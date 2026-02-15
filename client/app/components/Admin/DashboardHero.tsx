import React, { FC, useState } from "react";
import DashboardHeader from "../Admin/DashboardHeader";
import DashboardWidgets from "../Admin/Widgets/DashboardWidgets";


type DashboardHeroProps = {
  isDashboard?: boolean;
};

const DashboardHero = ({ isDashboard }: DashboardHeroProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <DashboardHeader open={open} setOpen={setOpen} />
      {isDashboard && <DashboardWidgets open={open} />}
    </div>
  );
};

export default DashboardHero;