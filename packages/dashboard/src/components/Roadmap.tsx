"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ProjectRoadmapIcon } from "@primer/octicons-react";
import { useTranslation, type TranslationKey } from "@/lib/i18n";
import type { Task } from "@/lib/customer";

interface Week {
  week: number;
  theme: string;
  hypothesis?: string;
  metric?: string;
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
  medium: "bg-amber-500/70 text-white",
  low: "bg-muted text-muted-foreground",
};

const priorityBadgeVariant: Record<Task["priority"], string> = {
  high: "bg-primary/15 text-primary border-primary/20",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
  low: "bg-muted text-muted-foreground border-border",
};

export default function Roadmap({ currentWeek, weeks }: RoadmapProps) {
  const { t } = useTranslation();
  const [selectedSprint, setSelectedSprint] = useState(currentWeek);

  const allTasks = weeks.flatMap((w) => w.tasks);
  const selectedWeek = weeks.find((w) => w.week === selectedSprint);

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <span className="size-5 rounded bg-primary/10 flex items-center justify-center">
          <ProjectRoadmapIcon size={14} />
        </span>
        <h2 className="text-sm font-semibold">{t("roadmap.title")}</h2>
      </div>

      {/* Calendar Timeline View */}
      <div className="rounded-lg border overflow-hidden">
        <div className="px-3 py-2 border-b bg-muted/30">
          <span className="text-xs font-medium text-muted-foreground">{t("roadmap.timeline")}</span>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[672px]">
            {/* Sprint header row */}
            <div className="grid grid-cols-4">
              {Array.from({ length: SPRINTS }, (_, i) => {
                const sprintNum = i + 1;
                const isCurrent = sprintNum === currentWeek;
                const isSelected = sprintNum === selectedSprint;
                return (
                  <button
                    key={`sprint-header-${sprintNum}`}
                    type="button"
                    onClick={() => setSelectedSprint(sprintNum)}
                    className={`px-2 py-1.5 text-xs font-medium border-b text-center transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : isCurrent
                        ? "bg-primary/5 text-primary/70"
                        : "text-muted-foreground hover:bg-muted/30"
                    } ${i < SPRINTS - 1 ? "border-r" : ""}`}
                  >
                    {t("roadmap.sprint")} {sprintNum}
                  </button>
                );
              })}
            </div>

            {/* Day labels row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${TOTAL_DAYS}, minmax(24px, 1fr))`,
              }}
            >
              {Array.from({ length: TOTAL_DAYS }, (_, i) => {
                const day = i + 1;
                const sprintIndex = Math.floor(i / 7);
                const isSelected = sprintIndex + 1 === selectedSprint;
                const isLastInSprint = (i + 1) % 7 === 0 && i < TOTAL_DAYS - 1;
                return (
                  <div
                    key={`day-${day}`}
                    className={`px-0.5 py-1 text-xs text-center border-b ${
                      isSelected
                        ? "bg-primary/5 text-primary/70"
                        : "text-muted-foreground/60"
                    } ${isLastInSprint ? "border-r" : ""}`}
                  >
                    {day}
                  </div>
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
              <span className="text-sm font-semibold">
                {t("roadmap.sprint")} {selectedWeek.week}
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
