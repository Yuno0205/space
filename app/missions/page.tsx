import { FadeIn } from "@/utils/animations/fade-in";
import { MissionCard } from "@/components/mission-card";

export default function MissionsPage() {
  return (
    <div className="container mx-auto max-w-5xl py-10 px-4">
      <FadeIn>
        <h1 className="text-4xl font-bold mb-6">Space Missions</h1>
        <p className="text-gray-400 mb-10 max-w-3xl">
          Explore our ongoing and upcoming space missions. From deep space exploration to orbital
          research, our missions push the boundaries of human knowledge and technological
          capabilities.
        </p>
      </FadeIn>

      <div className="space-y-8">
        <FadeIn delay={0.1}>
          <h2 className="text-2xl font-bold mb-4">Active Missions</h2>
          <div className="space-y-4">
            <MissionCard
              title="Proxima Centauri Exploration"
              status="Active"
              progress={75}
              description="Studying our nearest stellar neighbor and its potentially habitable exoplanets."
            />
            <MissionCard
              title="Interstellar Medium Survey"
              status="Active"
              progress={60}
              description="Mapping the composition of matter between star systems in our galaxy."
            />
            <MissionCard
              title="Lunar Gateway Construction"
              status="Active"
              progress={45}
              description="Building the orbital outpost that will serve as a staging point for lunar and Mars missions."
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2 className="text-2xl font-bold mb-4 mt-10">Preparing Missions</h2>
          <div className="space-y-4">
            <MissionCard
              title="Quantum Gravity Probe"
              status="Preparing"
              progress={35}
              description="Testing the boundaries between quantum mechanics and general relativity."
            />
            <MissionCard
              title="Mars Sample Return"
              status="Preparing"
              progress={28}
              description="Mission to collect and return samples from the Martian surface to Earth for detailed analysis."
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <h2 className="text-2xl font-bold mb-4 mt-10">Completed Missions</h2>
          <div className="space-y-4">
            <MissionCard
              title="Asteroid Redirect Test"
              status="Completed"
              progress={100}
              description="Successfully demonstrated technology to change the trajectory of an asteroid."
            />
            <MissionCard
              title="Solar Probe Plus"
              status="Completed"
              progress={100}
              description="Studied the outer corona of the Sun to improve our understanding of solar physics."
            />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
