"use client";

import { getCustomer, type Task } from "@/lib/customer";
import Roadmap from "@/components/Roadmap";

export default function RoadmapPage() {
  const c = getCustomer();

  if (!c.roadmap) return null;

  return (
    <Roadmap currentWeek={c.roadmap.currentWeek} weeks={c.roadmap.weeks as { week: number; theme: string; tasks: Task[]; hours: string; deliverable: string; goNoGo?: { go: string; adjust: string; redesign: string } }[]} />
  );
}
