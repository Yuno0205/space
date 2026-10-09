import { ReviewSession } from "@/components/features/English/review";
import { getReviewSessionData } from "@/components/features/English/review/_lib/get-review-session-data";

export default async function ReviewPage() {
  const initialData = await getReviewSessionData();

  return (
    <div className="container mx-auto md:px-4 px-2 md:py-8 py-4">
      <ReviewSession key={initialData.loadedAt} initialData={initialData} />
    </div>
  );
}
