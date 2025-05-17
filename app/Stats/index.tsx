import { CountUp } from "@/components/animations/count-up";
import { FadeIn } from "@/components/animations/fade-in";

export default function Stats() {
  return (
    <section className="relative py-16 px-4 border-t border-border">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <FadeIn delay={0.1}>
            <div className="flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-bold">
                <CountUp end={3} suffix="K+" />
              </p>
              <p className="text-sm text-muted-foreground">Vocabulary across topics</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-bold">
                <CountUp end={9} suffix="+" />
              </p>
              <p className="text-sm text-muted-foreground">Learning Modules & Features</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-bold">
                <CountUp end={20} suffix="+" />
              </p>
              <p className="text-sm text-muted-foreground">Courses and Lessons</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-bold">
                <CountUp end={120} suffix="M+" />
              </p>
              <p className="text-sm text-muted-foreground">Speaking Practice</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
