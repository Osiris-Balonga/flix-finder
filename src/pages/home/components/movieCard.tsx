import React from "react";
import { Link } from "react-router-dom";
import { MovieModel } from "../../../models/movie.model";
import { shareMovie, toggleLike } from "../../../utils/movieUtils";

interface MovieCardProps {
  movie: MovieModel;
  likedMovies: { [key: number]: boolean };
  onToggleLike: (updated: { [key: number]: boolean }) => void;
  to: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  likedMovies,
  onToggleLike,
  to,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full p-4 text-center text-white bg-black/60 rounded-3xl backdrop-blur-xl max-w-64 md:max-w-md">
      <button
        onClick={() => onToggleLike(toggleLike(movie.id, likedMovies))}
        className="absolute text-2xl top-4 right-3 focus:outline-none"
      >
        <i
          className={`ri-heart-${
            likedMovies[movie.id] ? "fill text-red-600" : "line text-red-600"
          }`}
        ></i>
      </button>
      <button
        onClick={() => shareMovie(movie)}
        className="absolute text-2xl top-12 right-3 focus:outline-none"
      >
        <i className="text-zinc-300 ri-share-forward-line"></i>
      </button>
      <img
        src={movie.image}
        alt={movie.title}
        className="object-contain h-64 mb-4 max-w-40"
      />
      <h2 className="mb-2 text-xl font-semibold">{movie.title}</h2>
      <div className="flex items-center justify-center mb-2">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`h-7 w-5 ${
              index < Math.floor(movie.rating)
                ? "text-yellow-400"
                : "text-zinc-400"
            }`}
          >
            <i className="ri-star-fill"></i>
          </span>
        ))}
        <span className="ml-2 text-sm">{movie.rating.toFixed(1)}</span>
      </div>
      <div className="flex flex-wrap justify-center mb-8">
        {movie.genres.map((genre, index) => (
          <span
            key={index}
            className="px-2 py-1 m-1 text-xs bg-zinc-700 rounded-xl"
          >
            {genre}
          </span>
        ))}
      </div>
      <Link
        to={to}
        className="w-full py-2 mb-2 font-semibold bg-red-600 rounded-lg md:hover:bg-red-700"
      >
        Voir plus
      </Link>
    </div>
  );
};

export default MovieCard;
