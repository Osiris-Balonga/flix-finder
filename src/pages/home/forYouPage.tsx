import { useLikedMovies, useLoadMovies } from "../../hooks/useMovieHooks";
import { MovieService } from "../../services/movie.service";
import MovieSwiper from "./components/MovieSwiper";

const movieService = new MovieService();

export default function ForYouPage() {
  const { likedMovies, handleToggleLike } = useLikedMovies();
  const { movies, isLoading, page, setPage } = useLoadMovies(
    movieService,
    async () => {
      const likedMovieIds = Object.keys(likedMovies).map(Number);
      const currentLikedMovieId = likedMovieIds[0]; // Gérer l'index si nécessaire
      return movieService.fetchSimilarMovies(currentLikedMovieId);
    }
  );

  return (
    <div className="relative flex items-center justify-center w-full h-screen p-0 overflow-hidden">
      <MovieSwiper
        movies={movies}
        isLoading={isLoading}
        likedMovies={likedMovies}
        onToggleLike={handleToggleLike}
        onSlideChange={() => {
          if (movies.length >= page * 20) {
            setPage((prevPage) => prevPage + 1);
          }
        }}
      />
    </div>
  );
}
