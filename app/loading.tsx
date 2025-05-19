import LoadingAnimation from "@/components/Fallback/loading-animation";

export default async function Loading() {
  return (
    <div className="w-full h-full min-h-screen">
      <LoadingAnimation />
    </div>
  );
}
