import { useEffect, useState, useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { MovieModel } from "../../models/movie.model";
import { MovieService } from "../../services/movie.service";
import MovieCard from "./components/movieCard";
import Skeleton from "./components/skeleton";

const movieService = new MovieService();

export default function PopularMovies() {
  const [movies, setMovies] = useState<MovieModel[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [likedMovies, setLikedMovies] = useState<{ [key: number]: boolean }>(
    JSON.parse(localStorage.getItem("likedMovies") || "{}")
  );

  const swiperRef = useRef<any>(null);

  useEffect(() => {
    loadMovies();
  }, [page]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        // Aller à la diapositive précédente
        swiperRef.current.swiper.slidePrev();
      } else if (event.key === "ArrowDown") {
        // Aller à la diapositive suivante
        swiperRef.current.swiper.slideNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const loadMovies = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const moviesWithVideos = await movieService.getMoviesWithVideos();

      setMovies((prevMovies) => {
        const uniqueMovies = moviesWithVideos.filter(
          (newMovie: any) =>
            !prevMovies.some((prevMovie) => prevMovie.id === newMovie.id)
        );
        return [...prevMovies, ...uniqueMovies];
      });
    } catch (error) {
      console.error("Erreur lors du fetch des films :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen p-0 overflow-hidden">
      <Swiper
        direction={"vertical"}
        className="w-full h-full"
        onSlideChange={(swiper: any) => {
          if (swiper.isEnd && !isLoading) {
            setPage((prevPage) => prevPage + 1);
          }
        }}
        ref={swiperRef}
      >
        {movies.map((movie) => (
          <SwiperSlide
            key={movie.id}
            className="flex flex-col items-center justify-center w-full h-full text-white bg-black/60 backdrop-blur-xl"
          >
            <div className="absolute inset-0">
              <img
                src={movie.image}
                alt={movie.title}
                className="object-cover w-full h-full filter blur-sm"
                style={{
                  filter: "blur(12px)",
                  transform: "scale(1)",
                }}
              />
              <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>
            <div className="flex items-center justify-center h-full">
              <MovieCard
                to={`/popular/${movie.id}`}
                movie={movie}
                likedMovies={likedMovies}
                onToggleLike={setLikedMovies}
              />
            </div>
          </SwiperSlide>
        ))}
        {isLoading && (
          <SwiperSlide className="flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-xl">
            <Skeleton />
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
}
