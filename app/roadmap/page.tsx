import { InfinityScrollLearningPath } from "@/components/learning-path";

export const revalidate = 3600;

export default async function LearningHomePage() {
  return (
    <div className="container mx-auto py-8 px-4 dark:bg-[url('/assets/images/stars_bg.jpg')] bg-none">
      <InfinityScrollLearningPath />
    </div>
  );
}
