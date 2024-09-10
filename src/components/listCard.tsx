import React from "react";
import { Link } from "react-router-dom";
import { MovieModel } from "../models/movie.model";
import { shareMovie, toggleLike } from "../utils/movieUtils";

interface ListCardProps {
  movie: MovieModel;
  likedMovies: { [key: number]: boolean };
  setLikedMovies: (likedMovies: { [key: number]: boolean }) => void;
  to: string;
}

const ListCard: React.FC<ListCardProps> = ({
  movie,
  likedMovies,
  setLikedMovies,
  to,
}) => {
  const handleLike = () => {
    const updatedLikedMovies = toggleLike(movie.id, likedMovies);
    setLikedMovies(updatedLikedMovies);
  };

  const handleShare = () => {
    shareMovie(movie);
  };

  return (
    <li className="relative flex items-center p-4">
      <img
        src={movie.image}
        alt={movie.title}
        className="object-cover w-20 rounded-lg h-30"
      />
      <div className="flex flex-col w-full ml-4">
        <h2 className="text-lg font-semibold text-white">{movie.title}</h2>
        <div className="flex items-center mt-2">
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
          <span className="ml-2 text-sm text-white">
            {movie.rating.toFixed(1)}
          </span>
        </div>
        <div className="flex flex-wrap mt-2">
          {movie.genres.map((genre, index) => (
            <span
              key={index}
              className="px-2 py-1 mb-2 mr-1 text-xs text-white bg-zinc-700 rounded-xl"
            >
              {genre}
            </span>
          ))}
        </div>
        <div className="flex mt-2 space-x-4">
          <button onClick={handleLike} className="text-2xl focus:outline-none">
            <i
              className={`ri-heart-${
                likedMovies[movie.id]
                  ? "fill text-red-600"
                  : "line text-red-600"
              }`}
            ></i>
          </button>
          <button onClick={handleShare} className="text-2xl focus:outline-none">
            <i className="text-zinc-300 ri-share-forward-line"></i>
          </button>
          <Link
            to={to}
            className="w-full py-2 mb-2 font-semibold text-center text-white rounded-lg max-w-40 bg-zinc-700"
          >
            Voir plus
          </Link>
        </div>
      </div>
    </li>
  );
};

export default ListCard;
