import { ReviewSession } from "@/components/features/English/review";
import { getReviewSessionData } from "@/components/features/English/review/_lib/get-review-session-data";

export default async function ReviewPage() {
  const initialData = await getReviewSessionData();

  return (
    <div className="container mx-auto px-4 py-8">
      <ReviewSession key={initialData.loadedAt} initialData={initialData} />
    </div>
  );
}
