import { ExploreCard } from "@/components/explore-card"
import { MissionCard } from "@/components/mission-card"
import { Newsletter } from "@/components/newsletter"
import { FadeIn } from "@/components/animations/fade-in"
import { AnimatedText } from "@/components/animations/animated-text"
import { CountUp } from "@/components/animations/count-up"
import { DashedHero } from "@/components/hero/dashed-hero"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <DashedHero
        title="The React Framework for the Web"
        description={
          <>
            Used by some of the world's largest companies, Next.js enables you to create{" "}
            <span className="font-semibold">high-quality web applications</span> with the power of React components.
          </>
        }
        primaryButtonText="Get Started"
        secondaryButtonText="Learn Next.js"
        commandText="npx create-next-app@latest"
      />

      {/* Stats Section */}
      <section className="relative py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <FadeIn delay={0.1}>
              <div className="flex flex-col items-center">
                <p className="text-3xl md:text-4xl font-bold">
                  <CountUp end={200} suffix="+" />
                </p>
                <p className="text-sm text-muted-foreground">Space Missions</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex flex-col items-center">
                <p className="text-3xl md:text-4xl font-bold">
                  <CountUp end={50} suffix="K+" />
                </p>
                <p className="text-sm text-muted-foreground">Stellar Photos</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col items-center">
                <p className="text-3xl md:text-4xl font-bold">
                  <CountUp end={120} suffix="+" />
                </p>
                <p className="text-sm text-muted-foreground">Research Papers</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col items-center">
                <p className="text-3xl md:text-4xl font-bold">
                  <CountUp end={15} suffix="M+" />
                </p>
                <p className="text-sm text-muted-foreground">Space Enthusiasts</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

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
              title="Black Holes"
              description="The mysterious cosmic entities where gravity pulls so much that even light cannot escape."
              image="/placeholder.svg?height=400&width=600"
              delay={0.2}
            />
            <ExploreCard
              title="Nebulae"
              description="Interstellar clouds of dust, hydrogen, helium and other ionized gases where stars are born."
              image="/placeholder.svg?height=400&width=600"
              delay={0.4}
            />
            <ExploreCard
              title="Exoplanets"
              description="Planets that orbit stars outside of our solar system, some potentially harboring life."
              image="/placeholder.svg?height=400&width=600"
              delay={0.6}
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
              title="Proxima Centauri Exploration"
              status="Active"
              progress={75}
              description="Studying our nearest stellar neighbor and its potentially habitable exoplanets."
              delay={0.2}
            />
            <MissionCard
              title="Quantum Gravity Probe"
              status="Preparing"
              progress={35}
              description="Testing the boundaries between quantum mechanics and general relativity."
              delay={0.4}
            />
            <MissionCard
              title="Interstellar Medium Survey"
              status="Active"
              progress={60}
              description="Mapping the composition of matter between star systems in our galaxy."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <FadeIn delay={0.2}>
            <Newsletter />
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
