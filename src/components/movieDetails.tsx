import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import defaultPerson from "../assets/images/no_image.jpg";
import { MovieModel } from "../models/movie.model";
import { MovieService } from "../services/movie.service";
import { shareMovie, toggleLike } from "../utils/movieUtils";
import OpenGraph from "./openGraph";
import MovieDetailSkeleton from "./skeleton";

const movieService = new MovieService();

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieModel | null>(null);
  const [likedMovies, setLikedMovies] = useState<{ [key: number]: boolean }>(
    JSON.parse(localStorage.getItem("likedMovies") || "{}")
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showAllCast, setShowAllCast] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const movieData = await movieService.fetchMovieById(Number(id));
        const videoData = await movieService.fetchMovieVideos(Number(id));
        const creditsData = await movieService.fetchMovieCredits(Number(id));

        const video = videoData.results.find(
          (vid: any) => vid.type === "Trailer"
        );
        const videoUrl = video
          ? `https://www.youtube.com/embed/${video.key}`
          : "";

        setMovie({
          id: movieData.id,
          title: movieData.title,
          image: movieData.poster_path
            ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
            : defaultPerson,
          rating: isNaN(movieData.vote_average)
            ? 0
            : movieData.vote_average / 2,
          genres: movieData.genres.map((genre: any) => genre.name),
          description: movieData.overview,
          releaseDate: movieData.release_date,
          producers: creditsData.crew
            .filter((member: any) => member.job === "Producer")
            .map((producer: any) => producer.name),
          cast: creditsData.cast,
          videoUrl,
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails du film :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleToggleLike = () => {
    if (movie) {
      const updatedLikedMovies = toggleLike(movie.id, likedMovies);
      setLikedMovies(updatedLikedMovies);
      localStorage.setItem("likedMovies", JSON.stringify(updatedLikedMovies));
    }
  };

  const handleShare = () => {
    if (movie) {
      shareMovie(movie);
    }
  };

  return (
    <>
      {movie && (
        <OpenGraph
          title={movie.title}
          description={movie.description}
          imageUrl={movie.image}
        />
      )}
      <div className="fixed top-0 left-0 z-50 w-full h-16 p-2 bg-zinc-900 lg:hidden">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 text-2xl rounded-full shadow bg-zinc-800 text-zinc-300 focus:outline-none md:hover:bg-zinc-700"
        >
          <i className="ri-arrow-left-line"></i>
        </button>
      </div>
      <div className="flex flex-col items-center min-h-screen p-4 my-14 text-white md:mb-0 bg-zinc-900 md:mx-auto md:max-w-[1000px] lg:mt-16">
        {loading ? (
          <MovieDetailSkeleton />
        ) : (
          movie && (
            <>
              <div className="relative w-full mb-4 md:max-w-lg">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="object-cover w-full h-auto rounded md:max-w-48 md:h-72 md:mx-auto"
                />
                <button
                  onClick={handleToggleLike}
                  className="absolute w-12 h-12 text-2xl text-red-600 rounded-full shadow bg-zinc-800 top-4 right-4 lg:right-0 lg:left-4 focus:outline-none md:hover:bg-zinc-700"
                >
                  <i
                    className={`ri-heart-${
                      likedMovies[movie.id] ? "fill" : "line"
                    }`}
                  ></i>
                </button>
                <button
                  onClick={handleShare}
                  className="absolute w-12 h-12 text-2xl rounded-full shadow top-20 bg-zinc-800 lg:top-4 right-4 text-zinc-300 focus:outline-none md:hover:bg-zinc-700"
                >
                  <i className="ri-share-forward-line"></i>
                </button>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-center">
                {movie.title}
              </h1>
              <p className="mb-2 text-zinc-400">
                Date de sortie : {movie.releaseDate}
              </p>
              <p className="mb-2 text-zinc-400">
                Producteurs : {movie.producers.join(", ")}
              </p>
              <div className="flex items-center mb-2">
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
              <div className="flex flex-wrap mb-4">
                {movie.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 m-1 text-xs bg-zinc-700 rounded-xl"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              {movie.videoUrl ? (
                <div className="w-full mb-4 max-h-60 md:h-96">
                  <iframe
                    width="100%"
                    height="100%"
                    className="rounded"
                    src={movie.videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full mb-4 bg-black rounded h-60">
                  <p className="mt-4 text-zinc-400">
                    <i className="ri-error-warning-line"></i> Bande annonce
                    indisponible.
                  </p>
                </div>
              )}
              {movie.description ? (
                <p className="mt-4 text-lg">{movie.description}</p>
              ) : (
                <p className="mt-4 text-lg text-zinc-400">
                  Description indisponible.
                </p>
              )}
              <div className="w-full mt-8 text-center">
                <h2 className="mb-4 text-2xl font-semibold">Casting</h2>
                {movie.cast.length === 0 ? (
                  <p className="text-lg text-zinc-400">
                    Aucun acteur disponible pour ce film.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {(showAllCast ? movie.cast : movie.cast.slice(0, 8)).map(
                        (actor: any) => (
                          <div key={actor.id} className="relative">
                            <img
                              src={
                                actor.profile_path
                                  ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                                  : "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
                              }
                              alt={actor.name}
                              className="object-cover w-full rounded-md h-52 md:h-72"
                            />
                            <div className="w-full p-1 mt-2 text-sm font-semibold text-center text-white bg-zinc-900 bg-opacity-80">
                              <p>{actor.name}</p>
                              <p className="text-xs text-zinc-400">
                                {actor.character}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    {movie.cast.length > 8 && (
                      <button
                        onClick={() => setShowAllCast(!showAllCast)}
                        className="px-4 py-2 mt-4 font-medium text-white rounded-full shadow bg-zinc-800"
                      >
                        {showAllCast ? (
                          <span>
                            Afficher moins
                            <i className="ml-2 text-lg ri-arrow-up-s-line"></i>
                          </span>
                        ) : (
                          <span>
                            Afficher plus
                            <i className="ml-2 text-lg ri-arrow-down-s-line"></i>
                          </span>
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          )
        )}
      </div>
    </>
  );
};

export default MovieDetails;
