// app/english/listening/page.tsx
import { FadeIn } from "@/components/animations/fade-in";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Dữ liệu mẫu, bạn nên fetch từ database
const listeningLevels = [
  {
    slug: "beginner",
    title: "Beginner (A1-A2)",
    description:
      "Focus on understanding basic phrases, simple questions, and short, slow conversations.",
    progress: 75,
    color: "border-blue-500/30 hover:border-blue-500/80",
    bgColor: "hover:bg-blue-500/5",
    progressColor: "bg-blue-500",
  },
  {
    slug: "intermediate",
    title: "Intermediate (B1-B2)",
    description:
      "Practice with longer dialogues, news segments, and understand main ideas in complex topics.",
    progress: 40,
    color: "border-green-500/30 hover:border-green-500/80",
    bgColor: "hover:bg-green-500/5",
    progressColor: "bg-green-500",
  },
  {
    slug: "advanced",
    title: "Advanced (C1-C2)",
    description:
      "Challenge yourself with academic lectures, fast-paced discussions, and understanding nuanced speech.",
    progress: 15,
    color: "border-purple-500/30 hover:border-purple-500/80",
    bgColor: "hover:bg-purple-500/5",
    progressColor: "bg-purple-500",
  },
];

export default function ListeningPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-2">Listening Practice</h1>
        <p className="text-muted-foreground mb-8">
          Choose your level to start improving your comprehension skills.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listeningLevels.map((level, index) => (
          <FadeIn key={level.slug} delay={index * 0.15}>
            <Link href={`/english/listening/${level.slug}`}>
              <Card
                className={`flex flex-col h-full transition-all duration-300 ${level.bgColor} ${level.color}`}
              >
                <CardHeader>
                  <CardTitle>{level.title}</CardTitle>
                  <CardDescription className="pt-2 min-h-[60px]">
                    {level.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-semibold">{level.progress}%</span>
                  </div>
                  <Progress value={level.progress} className="h-2 [&>div]:bg-primary" />
                </CardContent>
                <CardFooter>
                  <div className="flex items-center text-sm font-medium text-primary">
                    Start Practice
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
