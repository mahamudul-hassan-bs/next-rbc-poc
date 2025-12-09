import { NextRequest, NextResponse } from "next/server";
import staffDataWithEvents from "@/data/staffMemberWithEvent.json";
import totalShiftData from "@/data/totalShiftData.json";
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";

// Helper function to filter events within a specific month
function filterEventsForMonth(staffMembers: any, targetDate: Date) {
  const monthStart = startOfMonth(targetDate);
  const monthEnd = endOfMonth(targetDate);

  const filteredStaffMembers: any = {};

  for (const [role, members] of Object.entries(staffMembers) as [
    string,
    any[]
  ][]) {
    filteredStaffMembers[role] = members.map((member: any) => ({
      ...member,
      events: member.events.filter((event: any) => {
        const eventDate = parseISO(event.start);
        return isWithinInterval(eventDate, {
          start: monthStart,
          end: monthEnd,
        });
      }),
    }));
  }

  return filteredStaffMembers;
}

// Helper function to filter shift counts for a specific month
function filterShiftCountsForMonth(shiftCounts: any[], targetDate: Date) {
  const monthStart = startOfMonth(targetDate);
  const monthEnd = endOfMonth(targetDate);

  return shiftCounts.filter((shift: any) => {
    const shiftDate = parseISO(shift.start);
    return isWithinInterval(shiftDate, { start: monthStart, end: monthEnd });
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get("date");

  // Parse the date or use current date
  const targetDate = dateParam ? new Date(dateParam) : new Date();

  // Filter data for the requested month
  const filteredStaffMembers = filterEventsForMonth(
    staffDataWithEvents.staffMembers,
    targetDate
  );

  const filteredShiftCounts = filterShiftCountsForMonth(
    totalShiftData.shiftCount,
    targetDate
  );

  return NextResponse.json({
    staffMembers: filteredStaffMembers,
    shiftCount: filteredShiftCounts,
    month: targetDate.toISOString(),
  });
}
