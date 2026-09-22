import { Phoneme } from "@/types/pronunciation";
import { PhonemeCard } from "./phoneme-card";

interface PhonemeSectionProps {
  title: string;
  data: Phoneme[];
}

export function PhonemeSection({ title, data }: PhonemeSectionProps) {
  if (data.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-6 flex items-end gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {data.map((phoneme) => (
          <PhonemeCard key={phoneme.id} phoneme={phoneme} />
        ))}
      </div>
    </section>
  );
}
