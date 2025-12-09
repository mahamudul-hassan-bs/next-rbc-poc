"use client";
import React, { useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWeekend,
  isSameDay,
  parseISO,
} from "date-fns";
import Image from "next/image";
import DownArrow from "@/public/icon/DownArrow";
import FirstAider from "@/public/icon/FirstAider";
import Agency from "@/public/icon/Agency";
import FireMrshal from "@/public/icon/FireMrshal";
import Teamleader from "@/public/icon/Teamleader";
import { Tooltip } from "antd";
import ShiftView from "./ShiftView";
import Add from "@/public/icon/Add";

const roleOrder = ["nurse", "clinical_lead", "caregiver"] as const;
type RoleKey = (typeof roleOrder)[number];

const roleDisplayName: Record<RoleKey, string> = {
  nurse: "Nurse",
  clinical_lead: "Clinical Lead",
  caregiver: "Caregiver",
};

const CustomizedMonthView = ({ date, resourceWithEvents, shiftCount }) => {
  const [expandedRoles, setExpandedRoles] = React.useState<Set<RoleKey>>(
    new Set(["nurse"])
  );

  const toggleRole = (role: RoleKey) => {
    setExpandedRoles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(role)) {
        newSet.delete(role);
      } else {
        newSet.add(role);
      }
      return newSet;
    });
  };

  const monthDays = () => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  };

  const getShiftForDay = useCallback((day: Date, staffMember: any) => {
    if (!staffMember?.events) return null;
    return staffMember.events.find((event: any) =>
      isSameDay(parseISO(event.start), day)
    );
  }, []);

  const getCountForDay = (day, shiftCount) => {
    // console.log("shiftCount",shiftCount);
    // const date = format(day, "yyyy-MM-dd");
    // console.log(typeof shiftCount);
    const data = shiftCount.find((item) =>
      isSameDay(parseISO(item.start), day)
    );
    console.log("data", data);
    return data;
  };

  const days = monthDays();

  return (
    <div className="bg-white rounded-lg shadow-md w-full h-[calc(100vh-5px)] overflow-auto">
      <div className="min-w-max">
        <div className="flex bg-[#fafafa] border-b-2 border-[#eee] sticky top-0 z-50">
          <div className="flex sticky left-0 z-50 bg-[#fafafa]">
            <div className="w-[200px] min-w-[200px] px-3 py-4 font-semibold text-[#666] text-[12px] flex items-center border-r-2 border-[#eee] bg-[#fafafa]">
              <span>Staff Member</span>
            </div>
            <div className="w-20 min-w-20 px-3 py-4 font-semibold text-[#666] text-[12px] flex flex-col items-center border-r-2 border-[#eee] bg-[#fafafa]">
              <span>Summary</span>
            </div>
          </div>
          <div className="flex">
            {days.map((day) => (
              <div
                key={format(day, "yyyy-MM-dd")}
                className={`w-[64px] min-w-[64px] h-[72px] px-2 py-1 text-center border-l border-[#eee] cursor-pointer ${
                  isWeekend(day) ? "bg-[#f0f4df]" : ""
                }`}
              >
                <span className="block text-[10px] text-[#999] uppercase font-medium">
                  {format(day, "EEE")}
                </span>
                <span className="block text-[13px] text-[#999] mt-0.5 font-semibold">
                  {format(day, "d")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[120px] w-full bg-white flex">
          <div className="w-[280px] min-w-[280px] h-full flex items-center pl-2 border-r border-[#eee] sticky left-0 z-40 bg-white">
            <span className="text-[#407648] font-bold text-[16px]">
              Open Shifts
            </span>
          </div>
          <div className="flex h-auto">
            {days.map((day) => {
              const shiftCountForDay = getCountForDay(
                day,
                shiftCount.shiftCount
              );
              console.log("shiftCountForDay", shiftCountForDay);
              const isWeekendDay = isWeekend(day);
              console.log(shiftCountForDay);
              return (
                <div
                  key={format(day, "yyyy-MM-dd")}
                  className={`w-[64px] min-w-[64px] flex flex-col gap-2 items-center justify-center border-l border-[#eee] ${
                    isWeekendDay ? "bg-[#f8f9fa]" : ""
                  }`}
                >
                  {shiftCountForDay && (
                    <ShiftView
                      shift={shiftCountForDay}
                      role={shiftCountForDay.role}
                      shiftCount={true}
                    />
                  )}

                  <span
                    onClick={() => alert("Add shift")}
                    className="cursor-pointer p-2"
                  >
                    <Add />{" "}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {roleOrder.map((roleKey) => {
            const staffList = resourceWithEvents.staffMembers?.[roleKey] || [];
            if (staffList.length === 0) return null;

            const isExpanded = expandedRoles.has(roleKey);

            return (
              <div key={roleKey}>
                <div
                  className={`h-10 flex ${
                    roleKey === "nurse"
                      ? "bg-[#E8F7FB]"
                      : roleKey === "clinical_lead"
                      ? "bg-[#E7F0F0]"
                      : "bg-[#F5F1F6]"
                  }`}
                >
                  <button
                    onClick={() => toggleRole(roleKey)}
                    className={`h-full flex flex-row items-center text-left pl-5 ${
                      roleKey === "nurse"
                        ? "bg-[#45BDDC]"
                        : roleKey === "clinical_lead"
                        ? "bg-[#0C666B]"
                        : "bg-[#9975A5]"
                    } text-white w-[280px] min-w-[280px] text-sm font-medium transition-colors sticky left-0 z-40`}
                  >
                    <span className="text-sm pr-2">
                      {isExpanded ? <DownArrow /> : ">"}
                    </span>
                    <span>{roleDisplayName[roleKey]}</span>
                  </button>
                  <div className="flex">
                    {days.map((day) => (
                      <div
                        key={format(day, "yyyy-MM-dd")}
                        className="w-[64px] min-w-[64px] h-full border-l border-[#eee]/30"
                      />
                    ))}
                  </div>
                </div>

                {/* Staff Rows */}
                <div className={`${isExpanded ? "block" : "hidden"}`}>
                  {staffList.map((resource: any) => (
                    <div
                      key={resource.id}
                      className="flex border-b border-[#eee] items-stretch hover:bg-gray-50"
                    >
                      <div className="flex sticky left-0 z-30 bg-white">
                        <div className="w-[200px] min-w-[200px] px-1 py-2.5 flex items-center gap-2.5 border-r border-[#eee] bg-white">
                          <Image
                            src={resource.avatar || "/avatar-placeholder.png"}
                            alt={resource.name}
                            width={34}
                            height={34}
                            className="rounded-full object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-[16px] text-[#4E4E4E]">
                              {resource.name}
                            </span>
                            <span className="text-[11px] text-[#666] flex gap-1 flex-row items-center">
                              {resource.first_aider && (
                                <Tooltip
                                  placement="leftTop"
                                  title="First Aider"
                                >
                                  <span className="inline-flex items-center">
                                    <FirstAider />
                                  </span>
                                </Tooltip>
                              )}

                              {resource.from_agency && (
                                <Tooltip
                                  placement="leftTop"
                                  title="From Agency"
                                >
                                  <span className="inline-flex items-center">
                                    <Agency />
                                  </span>
                                </Tooltip>
                              )}

                              {resource.fire_marshal && (
                                <Tooltip
                                  placement="leftTop"
                                  title="Fire Marshal"
                                >
                                  <span className="inline-flex items-center">
                                    <FireMrshal />
                                  </span>
                                </Tooltip>
                              )}

                              {resource.team_lead && (
                                <Tooltip
                                  placement="leftTop"
                                  title="Team Leader"
                                >
                                  <span className="inline-flex items-center">
                                    <Teamleader />
                                  </span>
                                </Tooltip>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="w-[80px] min-w-[80px] p-[10px] flex flex-col justify-center border-r border-[#eee] bg-white text-center">
                          <span className="font-semibold text-[13px] text-[#2e7d32]">
                            {resource.totalHours || 0}h
                          </span>
                          <span className="text-[10px] text-[#999]">
                            {resource.totalShifts || 0} shifts
                          </span>
                        </div>
                      </div>

                      <div className="flex">
                        {days.map((day) => {
                          const shift = getShiftForDay(day, resource);
                          const isWeekendDay = isWeekend(day);

                          return (
                            <div
                              key={format(day, "yyyy-MM-dd")}
                              className={`w-[64px] min-w-[64px] h-[72px] flex items-center justify-center border-l border-[#eee] ${
                                isWeekendDay ? "bg-[#f8f9fa]" : ""
                              }`}
                            >
                              {shift && (
                                <span
                                  className="cursor-pointer"
                                  onClick={() => window.alert(resource.role)}
                                >
                                  <ShiftView
                                    shift={shift}
                                    role={resource.role}
                                  />
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomizedMonthView;
