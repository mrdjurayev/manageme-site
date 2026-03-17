import { LessonScheduleCanvas, LessonScheduleToolbar } from "@/components/lesson-schedule";
import { getRequiredUser } from "@/lib/auth/get-user";

export default async function SchedulePage() {
  await getRequiredUser();

  return (
    <main className="min-h-screen bg-[#efefef] px-3 py-5 md:px-5 md:py-8">
      <div className="mx-auto flex min-h-[calc(100dvh-2.5rem)] max-w-[2000px] flex-col gap-0 md:min-h-[calc(100dvh-4rem)]">
        <LessonScheduleToolbar />
        <LessonScheduleCanvas className="min-h-0 flex-1" />
      </div>
    </main>
  );
}
