import LoadingAnimation from "@/components/LoadingAnimation";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function Loading() {
  await wait(6000); // Đặt thời gian chờ

  // Sau khi chờ, render Client Component chứa UI loading
  return (
    <div className="w-full h-full min-h-screen">
      <LoadingAnimation />
    </div>
  );
}
