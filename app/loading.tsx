import LoadingAnimation from "@/components/LoadingAnimation"; // Import Client Component UI ở trên

export default async function Loading() {
  // Sau khi chờ, render Client Component chứa UI loading
  return (
    <div className="w-full h-full min-h-screen">
      <LoadingAnimation />
    </div>
  );
}
