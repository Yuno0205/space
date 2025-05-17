import { AnimatedText } from "@/components/animations/animated-text";
import { FadeIn } from "@/components/animations/fade-in";
import { SimplifiedContact } from "@/components/Contact";
import { ExploreCard } from "@/components/explore-card";
import { Footer } from "@/components/Footer/footer";
import { DashedHero } from "@/components/Hero/dashed-hero";
import { MissionCard } from "@/components/mission-card";
import PowerBy from "@/components/PowerBy";
import { supabaseBrowser } from "@/lib/supabase/client";
import Stats from "./Stats";

export default async function Home() {
  const { count } = await supabaseBrowser
    .from("vocabularies")
    .select("*", { count: "exact", head: true }) // Thêm head: true để chỉ lấy count
    .eq("is_learned", true);

  const { data: progress } = await supabaseBrowser
    .from("courses")
    .select("completed_words, total_words")
    .eq("letter", "a")
    .single();

  const { data: unstartedCourse } = await supabaseBrowser
    .from("courses")
    .select("*")
    .eq("completed_words", 0)
    .limit(1)
    .maybeSingle();

  return (
    <div className="relative min-h-screen bg-center dark:bg-[url('/assets/images/stars_bg.jpg')] bg-none">
      {/* Hero Section */}
      <DashedHero
        title="Welcome to Space v1.0.0 - Initiate your learning warp drive today"
        description={
          <>Where I learn, code, and grow — each star a new concept, each orbit a breakthrough.</>
        }
        primaryButtonHref="/english/dialogue"
        primaryButtonText="Visit the English planet"
        secondaryButtonText="Explore the Next.js universe"
      />

      {/* Stats Section */}
      <Stats />

      {/* Power by section */}
      <PowerBy />

      {/* Explore Section */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <AnimatedText delay={0.1}>
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore the Universe</h2>
              <p className="text-muted-foreground max-w-2xl">
                Dive into our curated collection of cosmic wonders and scientific discoveries.
              </p>
            </div>
          </AnimatedText>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ExploreCard
              title="Empathic Voice Interface (EVI)"
              description="EVI 2: New voice-to-voice AI for rapid, natural conversations that understands and matches your tone."
              image="/assets/images/hume_showcase.png?height=400&width=600"
              delay={0.2}
              href="/english/dialogue"
            />

            <ExploreCard
              title="Learn English with Flashcards"
              description="Conquer vocabulary effectively with smart Flashcards: learn quickly, remember long, improve every day!"
              image="/assets/images/flashcards-showcase.png?height=400&width=600"
              delay={0.4}
              href="/english/vocabulary"
            />
            <ExploreCard
              title="Speaking Practice"
              description="Speak, get detailed feedback, and perfect your pronunciation with our Speaking Practice feature!"
              image="/assets/images/speaking_showcase.png?height=400&width=600"
              delay={0.6}
              href="/english/speaking"
            />
          </div>
        </div>
      </section>

      {/* Missions Section */}
      <section className="relative py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <AnimatedText delay={0.1}>
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Current Missions</h2>
              <p className="text-muted-foreground max-w-2xl">
                Follow our ongoing expeditions to unravel the secrets of the cosmos.
              </p>
            </div>
          </AnimatedText>

          <div className="space-y-6">
            <MissionCard
              title="Word Voyager: Your Expedition Log"
              status="Active"
              completedTasks={count || 0}
              totalTasks={3874}
              description="Your vocabulary universe is expanding! See how many 
              linguistic stars you've collected and how many new galaxies of words await.
               Keep charting, astronaut!"
              delay={0.2}
            />
            <MissionCard
              title="Asteroid A: Lexical Excavation Zone"
              status="Active"
              completedTasks={progress?.completed_words || 0}
              totalTasks={progress?.total_words || 0}
              description="Long-range sensors are picking up intriguing lexical signals from Asteroid A.
               Some terms are familiar, others... well, they're definitely 'alien.' 
               Proceed with curiosity and an open mind!"
              delay={0.4}
            />
            <MissionCard
              title="Planet Z Archives: All Glyphs Deciphered"
              status="Completed"
              completedTasks={2}
              totalTasks={2}
              description="Mission accomplished! All linguistic artifacts from Planet Z have been successfully collected and archived in the central data core. "
              delay={0.4}
            />
            {unstartedCourse && (
              <MissionCard
                title={`Uncharted Nebula ${unstartedCourse.letter}: Awaiting Your First Scan`}
                status="Preparing"
                completedTasks={unstartedCourse.completed_words}
                totalTasks={unstartedCourse.total_words}
                description={`This dense nebula, ${unstartedCourse.name}, contains approximately ${unstartedCourse.total_words} 
              undiscovered linguistic phenomena. Your mission, should you choose to accept it, 
              is to be the first to map its wonders. Are your sensors calibrated?`}
                delay={0.4}
              />
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <FadeIn delay={0.2}>
            <SimplifiedContact />
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
