import OverTime from "@/public/icon/OverTime";
import Warning from "@/public/icon/Warning";
import React from "react";

const ShiftView = ({ shift, role, width = "w-[56px]", shiftCount = false }) => {
  console.log(role);
  return (
    <div
      className={`flex flex-col items-center h-[56px] ${
        role === "nurse"
          ? "bg-[#E8F7FB] border-l-2 border-[#17ADD3]"
          : role === "clinical_lead"
          ? "bg-[#E7F0F0] border-l-2 border-[#0C666B]"
          : "bg-[#F5F1F6] border-l-2 border-[#9975A5]"
      } px-2 py-[2px] h-[56px] rounded text-[11px] font-semibold border-l-[3px] cursor-pointer transition-transform duration-100 hover:scale-[1.08] hover:shadow-md ${width}`}
    >
      <div>
        {shift.shiftStartTime + " - " + shift.shiftEndTime ||
          shift.title ||
          "Shift"}
      </div>

      <div className="flex flex-row">
        {shift.overTime && <OverTime />}
        {shift.warning && <Warning />}
        {shiftCount && (
          <div
            className={`h-4 w-4 text-center text-white rounded-full ${
              role === "nurse"
                ? "bg-[#17ADD3]"
                : role === "clinical_lead"
                ? "bg-[#0C666B]"
                : "bg-[#9975A5]"
            }`}
          >
            {shift.totalCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftView;
