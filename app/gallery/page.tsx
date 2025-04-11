import { FadeIn } from "@/components/animations/fade-in"
import { ExploreCard } from "@/components/explore-card"

export default function GalleryPage() {
  return (
    <div className="container mx-auto max-w-5xl py-10 px-4">
      <FadeIn>
        <h1 className="text-4xl font-bold mb-6">Space Gallery</h1>
        <p className="text-gray-400 mb-10 max-w-3xl">
          Explore our collection of stunning images from across the cosmos. From nebulae to galaxies, black holes to
          exoplanets, witness the beauty and majesty of our universe.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FadeIn delay={0.1}>
          <ExploreCard
            title="Carina Nebula"
            description="A vast stellar nursery located approximately 7,500 light-years from Earth."
            image="/placeholder.svg?height=400&width=600"
          />
        </FadeIn>
        <FadeIn delay={0.2}>
          <ExploreCard
            title="Andromeda Galaxy"
            description="The nearest major galaxy to the Milky Way, containing approximately one trillion stars."
            image="/placeholder.svg?height=400&width=600"
          />
        </FadeIn>
        <FadeIn delay={0.3}>
          <ExploreCard
            title="Pillars of Creation"
            description="Elephant trunks of interstellar gas and dust in the Eagle Nebula."
            image="/placeholder.svg?height=400&width=600"
          />
        </FadeIn>
        <FadeIn delay={0.4}>
          <ExploreCard
            title="Supermassive Black Hole"
            description="The central black hole of our Milky Way galaxy, known as Sagittarius A*."
            image="/placeholder.svg?height=400&width=600"
          />
        </FadeIn>
        <FadeIn delay={0.5}>
          <ExploreCard
            title="Europa"
            description="Jupiter's moon with a subsurface ocean that may harbor extraterrestrial life."
            image="/placeholder.svg?height=400&width=600"
          />
        </FadeIn>
        <FadeIn delay={0.6}>
          <ExploreCard
            title="Helix Nebula"
            description="A large planetary nebula located in the constellation Aquarius."
            image="/placeholder.svg?height=400&width=600"
          />
        </FadeIn>
      </div>
    </div>
  )
}
