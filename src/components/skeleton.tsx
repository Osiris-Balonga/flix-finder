import React from 'react';

const MovieDetailSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 mb-16 bg-zinc-900 text-white md:mx-auto md:max-w-[1000px]">
      <div className="relative w-full max-w-4xl mb-4 animate-pulse">
        <div className="w-full rounded bg-zinc-700 h-72"></div>
      </div>
      <div className="w-full max-w-4xl mb-4 animate-pulse">
        <div className="flex flex-wrap mb-4">
          {[...Array(1)].map((_, index) => (
            <div key={index} className="h-4 rounded-full w-72 md:w-[800px] bg-zinc-700"></div>
          ))}
        </div>
        <div className="w-full mb-4 max-h-60">
          <div className="w-full h-full rounded bg-zinc-700"></div>
        </div>
        <div className="w-full mb-4">
          <div className="h-4 mb-4 rounded-full bg-zinc-700"></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="relative">
                <div className="w-full rounded-md bg-zinc-700 h-52"></div>
                <div className="absolute bottom-0 left-0 w-full py-2 text-xs text-center text-white rounded-md bg-zinc-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailSkeleton;
