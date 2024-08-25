export default function ListSkeleton() {
  return (
    <ul className="divide-y divide-zinc-700">
      {[...Array(5)].map((_, index) => (
        <li key={index} className="flex py-4 space-x-4 animate-pulse">
          <div className="w-16 h-24 rounded bg-zinc-700"></div>
          <div className="flex flex-col flex-grow space-y-2">
            <div className="w-1/2 h-4 rounded bg-zinc-700"></div>
            <div className="w-3/4 h-4 rounded bg-zinc-700"></div>
            <div className="w-1/4 h-4 rounded bg-zinc-700"></div>
            <div className="w-1/2 h-4 rounded bg-zinc-700"></div>
          </div>
        </li>
      ))}
    </ul>
  );
}
