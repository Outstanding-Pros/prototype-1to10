"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ProjectRoadmapIcon } from "@primer/octicons-react";
import { useTranslation, useLanguage, type TranslationKey } from "@/lib/i18n";
import type { Task } from "@/lib/customer";

interface RevenueImpact {
  scenario: string;
  expectedMrr: number;
  description: string;
}

interface Week {
  week: number;
  theme: string;
  hypothesis?: string;
  metric?: string;
  revenueImpact?: RevenueImpact;
  tasks: Task[];
  hours: string;
  deliverable: string;
  goNoGo?: {
    go: string;
    adjust: string;
    redesign: string;
  };
}

interface RoadmapProps {
  currentWeek: number;
  weeks: Week[];
}

const TOTAL_DAYS = 28;
const SPRINTS = 4;
const BAR_HEIGHT = 28;
const BAR_GAP = 4;

const priorityBarClass: Record<Task["priority"], string> = {
  high: "bg-primary/80 text-primary-foreground",
  medium: "bg-chart-2/70 text-white",
  low: "bg-muted text-muted-foreground",
};

const priorityBadgeVariant: Record<Task["priority"], string> = {
  high: "bg-primary/15 text-primary border-primary/20",
  medium: "bg-chart-2/15 text-chart-2 border-chart-2/20",
  low: "bg-muted text-muted-foreground border-border",
};

export default function Roadmap({ currentWeek, weeks }: RoadmapProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedSprint, setSelectedSprint] = useState(currentWeek);

  const allTasks = weeks.flatMap((w) => w.tasks);
  const selectedWeek = weeks.find((w) => w.week === selectedSprint);

  function sprintLabel(n: number) {
    return language === "ko" ? `${n}${t("roadmap.weekUnit")}` : `${t("roadmap.weekUnit")} ${n}`;
  }

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="size-5 rounded bg-primary/10 flex items-center justify-center">
            <ProjectRoadmapIcon size={14} />
          </span>
          <h2 className="text-base font-semibold">{t("roadmap.title")}</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1 ml-7">{t("roadmap.summary")}</p>
      </div>

      {/* Calendar Timeline View */}
      <div className="rounded-lg border overflow-hidden">
        <div className="px-3 py-2 border-b bg-muted/30">
          <span className="text-xs font-medium text-muted-foreground">{t("roadmap.timeline")}</span>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[672px]">
            {/* Sprint header + day labels — unified click area per sprint */}
            <div className="grid grid-cols-4">
              {Array.from({ length: SPRINTS }, (_, i) => {
                const sprintNum = i + 1;
                const isCurrent = sprintNum === currentWeek;
                const isSelected = sprintNum === selectedSprint;
                const days = Array.from({ length: 7 }, (_, d) => i * 7 + d + 1);
                return (
                  <button
                    key={`sprint-col-${sprintNum}`}
                    type="button"
                    onClick={() => setSelectedSprint(sprintNum)}
                    className={`border-b transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary/10"
                        : isCurrent
                        ? "bg-primary/5"
                        : "hover:bg-muted/40"
                    } ${i < SPRINTS - 1 ? "border-r" : ""}`}
                  >
                    {/* Sprint name */}
                    <div
                      className={`px-2 py-1.5 text-xs font-medium text-center border-b border-border/40 ${
                        isSelected
                          ? "text-primary"
                          : isCurrent
                          ? "text-primary/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {sprintLabel(sprintNum)}
                    </div>
                    {/* Day numbers */}
                    <div className="grid grid-cols-7">
                      {days.map((day) => (
                        <div
                          key={`day-${day}`}
                          className={`px-0.5 py-1 text-xs text-center ${
                            isSelected
                              ? "text-primary/70"
                              : "text-muted-foreground/60"
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Task bars area */}
            <div
              className="relative"
              style={{ height: allTasks.length * (BAR_HEIGHT + BAR_GAP) + BAR_GAP }}
            >
              {/* Sprint column highlights */}
              {Array.from({ length: SPRINTS }, (_, i) => {
                const isSelected = i + 1 === selectedSprint;
                return (
                  <div
                    key={`col-${i}`}
                    className={`absolute top-0 bottom-0 ${isSelected ? "bg-primary/5" : ""} ${
                      i < SPRINTS - 1 ? "border-r" : ""
                    }`}
                    style={{ left: `${i * 25}%`, width: "25%" }}
                  />
                );
              })}

              {/* Task bars */}
              {allTasks.map((task, idx) => {
                const left = ((task.startDay - 1) / TOTAL_DAYS) * 100;
                const width = ((task.endDay - task.startDay + 1) / TOTAL_DAYS) * 100;
                return (
                  <div
                    key={idx}
                    className={`absolute rounded-sm flex items-center overflow-hidden ${priorityBarClass[task.priority]}`}
                    style={{
                      left: `calc(${left}% + 2px)`,
                      width: `calc(${width}% - 4px)`,
                      top: idx * (BAR_HEIGHT + BAR_GAP) + BAR_GAP,
                      height: BAR_HEIGHT,
                    }}
                  >
                    <span className="text-xs font-medium px-2 truncate">
                      {task.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Sprint Detail */}
      {selectedWeek && (
        <div
          className={`rounded-lg p-4 transition-colors ${
            selectedWeek.week === currentWeek
              ? "ring-1 ring-primary/20 bg-primary/5"
              : "bg-muted/20"
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              {selectedWeek.week === currentWeek && (
                <Badge className="text-xs py-0">{t("roadmap.current")}</Badge>
              )}
              <span className="text-base font-semibold">
                {sprintLabel(selectedWeek.week)}
              </span>
              <span className="text-xs text-muted-foreground">{selectedWeek.theme}</span>
            </div>
            <span className="text-xs text-muted-foreground">{selectedWeek.hours}</span>
          </div>

          {(selectedWeek.hypothesis || selectedWeek.metric) && (
            <div className="mb-3 rounded-md bg-muted/40 px-3 py-2 space-y-1">
              {selectedWeek.hypothesis && (
                <p className="text-xs">
                  <span className="font-medium text-muted-foreground">{t("roadmap.hypothesis")}:</span>{" "}
                  <span className="text-foreground/80">{selectedWeek.hypothesis}</span>
                </p>
              )}
              {selectedWeek.metric && (
                <p className="text-xs">
                  <span className="font-medium text-muted-foreground">{t("roadmap.metric")}:</span>{" "}
                  <span className="text-foreground/80">{selectedWeek.metric}</span>
                </p>
              )}
            </div>
          )}

          {/* Revenue Impact */}
          {selectedWeek.revenueImpact && (
            <div className="mb-3 rounded-md border border-chart-3/20 bg-chart-3/5 px-3 py-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-chart-3">{t("roadmap.revenueImpact")}</span>
                <Badge variant="outline" className="text-xs py-0 bg-chart-3/10 text-chart-3 border-chart-3/20">
                  {t("roadmap.linkedScenario")}: {selectedWeek.revenueImpact.scenario}
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-muted-foreground">{t("roadmap.expectedMrr")}</span>
                <span className="text-sm font-bold tabular-nums text-chart-3">
                  ₩{selectedWeek.revenueImpact.expectedMrr.toLocaleString("ko-KR")}
                </span>
              </div>
              <p className="text-xs text-foreground/70">{selectedWeek.revenueImpact.description}</p>
            </div>
          )}

          <ul className="space-y-1.5 mb-3">
            {selectedWeek.tasks.map((task, j) => (
              <li key={j} className="flex items-center gap-2 text-sm">
                <span className="mt-0.5 size-3.5 rounded border border-border flex-shrink-0" />
                <span className="text-foreground/80 flex-1">{task.name}</span>
                <span
                  className={`inline-flex items-center rounded-full border px-1.5 py-0 text-xs font-medium leading-4 ${
                    priorityBadgeVariant[task.priority]
                  }`}
                >
                  {t(`roadmap.priority.${task.priority}` as TranslationKey)}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {t("roadmap.day")}{task.startDay}-{t("roadmap.day")}{task.endDay}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{t("roadmap.deliverable")}</span>
            <Badge variant="outline" className="text-xs font-normal">
              {selectedWeek.deliverable}
            </Badge>
          </div>

          {selectedWeek.goNoGo && (
            <>
              <div className="border-b my-3" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">{t("roadmap.criteria")}</p>
                <p className="text-xs text-green-600">{selectedWeek.goNoGo.go}</p>
                <p className="text-xs text-yellow-600">{selectedWeek.goNoGo.adjust}</p>
                <p className="text-xs text-destructive">{selectedWeek.goNoGo.redesign}</p>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
