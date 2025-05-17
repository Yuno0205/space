import LoadingAnimation from "@/components/Fallback/loading-animation";

export default async function Loading() {
  // Sau khi chờ, render Client Component chứa UI loading
  return (
    <div className="w-full h-full min-h-screen">
      <LoadingAnimation />
    </div>
  );
}
