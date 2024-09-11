import { useEffect, useState } from "react";
import noData from "../../assets/images/no-data.png";
import noImage from "../../assets/images/no_image.jpg";
import ListCard from "../../components/listCard";
import ListSkeleton from "../../components/listSkeleton";
import { MovieModel } from "../../models/movie.model";
import { MovieService } from "../../services/movie.service";
import { getGenreName } from "../../utils/movieUtils";

const movieService = new MovieService();

export default function LikedMovies() {
  const [likedMovies, setLikedMovies] = useState<MovieModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [likedMoviesState, setLikedMoviesState] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    const loadLikedMovies = async () => {
      setIsLoading(true);
      try {
        const savedLikedMovies = JSON.parse(
          localStorage.getItem("likedMovies") || "{}"
        );
        setLikedMoviesState(savedLikedMovies);

        const movieIds = Object.keys(savedLikedMovies);

        if (movieIds.length > 0) {
          const movieResponses = await Promise.all(
            movieIds.map((id) => movieService.fetchMovieById(Number(id)))
          );

          const moviesWithVideos = await Promise.all(
            movieResponses.map(async (movie: any) => {
              const rating = movie.vote_average ? movie.vote_average / 2 : 0;
              const videoData = await movieService.fetchMovieVideos(movie.id);
              const video = videoData.results.find(
                (vid: any) => vid.type === "Trailer"
              );
              const videoUrl = video
                ? `https://www.youtube.com/watch?v=${video.key}`
                : "";

              const genres = movie.genres.map((genre: any) =>
                getGenreName(genre.id)
              );

              return {
                id: movie.id,
                title: movie.title,
                image: movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : noImage,
                rating: isNaN(rating) ? 0 : rating,
                genres,
                description: movie.overview,
                videoUrl,
                releaseDate: movie.release_date || "",
                producers:
                  movie.production_companies?.map((comp: any) => comp.name) ||
                  [],
                cast: movie.cast?.map((member: any) => member.name) || [],
              } as MovieModel;
            })
          );

          setLikedMovies(moviesWithVideos);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des films aimés :", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLikedMovies();
  }, []);

  return (
    <div className="w-full min-h-screen px-2 py-12 bg-zinc-900 lg:max-w-[1000px] lg:mx-auto lg:px-0">
      {isLoading ? (
        <ListSkeleton />
      ) : likedMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <img src={noData} className="max-w-60" alt="" />
          <div className="text-white">Aucun film aimé pour le moment.</div>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-700">
          {likedMovies.map((movie) => (
            <ListCard
              to={`/movie/${movie.id}`}
              key={movie.id}
              movie={movie}
              likedMovies={likedMoviesState}
              setLikedMovies={setLikedMoviesState}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
