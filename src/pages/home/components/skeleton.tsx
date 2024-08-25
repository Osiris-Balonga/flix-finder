export default function Skeleton() {
  return (
    <div className="w-full h-screen bg-zinc-900">
      <div className="flex flex-col items-center justify-center w-full h-full p-4 mx-auto space-y-4 bg-zinc-900 animate-pulse max-w-72 md:max-w-md">
        <div className="w-3/4 rounded-lg h-60 bg-zinc-700"></div>
        <div className="w-2/4 h-8 rounded-lg bg-zinc-700"></div>
        <div className="w-1/4 h-6 rounded-lg bg-zinc-700"></div>
        <div className="w-2/4 h-6 rounded-lg bg-zinc-700"></div>
      </div>
    </div>
  );
}
