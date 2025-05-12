import SpeakingPractice from "@/components/english/speaking-practice";
import { usePronunciationStore } from "@/utils/Speech/pronunciation-store";

export default function Home() {
  return (
    <main className="container max-w-3xl mx-auto py-10 px-4">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold mb-4">Luyện nói và chấm điểm</h1>
        <p className="text-gray-400 mb-6">
          Luyện phát âm từ vựng bằng cách nói vào microphone. Hệ thống sẽ nhận dạng, đánh giá và
          chấm điểm phát âm của bạn.
        </p>
      </div>

      <SpeakingPractice />
    </main>
  );
}
