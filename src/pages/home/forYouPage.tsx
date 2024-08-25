import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { MovieModel } from "../../models/movie.model";
import { MovieService } from "../../services/movie.service";
import MovieCard from "./components/movieCard";
import Skeleton from "./components/skeleton";

const movieService = new MovieService();

export default function ForYouPage() {
  const [movies, setMovies] = useState<MovieModel[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLikedIndex, setCurrentLikedIndex] = useState(0);
  const [likedMovies, setLikedMovies] = useState<{ [key: number]: boolean }>(
    JSON.parse(localStorage.getItem("likedMovies") || "{}")
  );

  const swiperRef = useRef<any>(null);

  useEffect(() => {
    loadSimilarMovies();
  }, [currentLikedIndex, page]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        swiperRef.current.swiper.slidePrev();
      } else if (event.key === "ArrowDown") {
        swiperRef.current.swiper.slideNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const loadSimilarMovies = async () => {
    if (isLoading || currentLikedIndex >= Object.keys(likedMovies).length)
      return;

    setIsLoading(true);

    try {
      const likedMovieIds = Object.keys(likedMovies).map(Number);
      const currentLikedMovieId = likedMovieIds[currentLikedIndex];
      const similarMovies = await movieService.fetchSimilarMovies(
        currentLikedMovieId
      );

      setMovies((prevMovies) => {
        const uniqueMovies = similarMovies.filter(
          (newMovie: any) =>
            !prevMovies.some((prevMovie) => prevMovie.id === newMovie.id)
        );
        return [...prevMovies, ...uniqueMovies];
      });
    } catch (error) {
      console.error("Erreur lors du fetch des films similaires :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLike = (updatedLikes: { [key: number]: boolean }) => {
    setLikedMovies(updatedLikes);
    localStorage.setItem("likedMovies", JSON.stringify(updatedLikes));
  };

  const handleSlideChange = (swiper: any) => {
    if (swiper.isEnd && !isLoading) {
      if (movies.length >= page * 20) {
        setPage((prevPage) => prevPage + 1);
      } else {
        setCurrentLikedIndex((prevIndex) => prevIndex + 1);
        setPage(1);
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen p-0 overflow-hidden">
      <Swiper
        direction={"vertical"}
        className="w-full h-full"
        onSlideChange={handleSlideChange}
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
                }}
              />
              <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>
            <div className="flex items-center justify-center h-full">
              <MovieCard
                to={`/forYou/${movie.id}`}
                movie={movie}
                likedMovies={likedMovies}
                onToggleLike={handleToggleLike}
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
