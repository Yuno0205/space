import { LearningProgress } from "@/components/Dashboard/learning-progress";
import { TaskManager } from "@/components/Dashboard/task-manager";
import { PomodoroTimer } from "@/components/Dashboard/pomodoro-timer";
import { ResourceCollection } from "@/components/Dashboard/resource-collection";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Workspace của tôi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LearningProgress />
          <div className="mt-6">
            <TaskManager />
          </div>
          <div className="mt-6">
            <ResourceCollection />
          </div>
        </div>
        <div>
          <PomodoroTimer />
        </div>
      </div>
    </div>
  );
}
