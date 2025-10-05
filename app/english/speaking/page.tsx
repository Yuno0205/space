// app/english/speaking/page.tsx
import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Dữ liệu mẫu, bạn nên fetch từ database
const vowels = [
  { ipa: "iː", example: "sheep" },
  { ipa: "ɪ", example: "ship" },
  { ipa: "e", example: "bed" },
  { ipa: "æ", example: "cat" },
  // ... thêm các nguyên âm khác
];

const consonants = [
  { ipa: "p", example: "pen" },
  { ipa: "b", example: "bad" },
  { ipa: "t", example: "tea" },
  { ipa: "d", example: "did" },
  // ... thêm các phụ âm khác
];

const PhonemeCard = ({ ipa, example }: { ipa: string; example: string }) => (
  <Link href={`/english/speaking/phoneme/${encodeURIComponent(ipa)}`}>
    <div className="group relative flex flex-col items-center justify-center p-4 h-24 w-24 rounded-lg border border-border bg-card/50 transition-all duration-300 hover:bg-accent hover:border-primary/50 hover:scale-105">
      <span className="text-3xl font-bold text-foreground">{ipa}</span>
      <span className="text-sm text-muted-foreground mt-1">{example}</span>
    </div>
  </Link>
);

export default function SpeakingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-2">Speaking Practice</h1>
        <p className="text-muted-foreground mb-8">
          Master English pronunciation by practicing each sound individually.
        </p>
      </FadeIn>

      <div className="space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>Vowels (Nguyên âm)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {vowels.map((v) => (
              <PhonemeCard key={v.ipa} ipa={v.ipa} example={v.example} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consonants (Phụ âm)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {consonants.map((c) => (
              <PhonemeCard key={c.ipa} ipa={c.ipa} example={c.example} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
