import { useEffect, useState } from "react";
import { MovieService } from "../services/movie.service";
import { MovieModel } from "../models/movie.model";

export function useLikedMovies() {
  const [likedMovies, setLikedMovies] = useState<{ [key: number]: boolean }>(
    JSON.parse(localStorage.getItem("likedMovies") || "{}")
  );

  const handleToggleLike = (updatedLikes: { [key: number]: boolean }) => {
    setLikedMovies(updatedLikes);
    localStorage.setItem("likedMovies", JSON.stringify(updatedLikes));
  };

  return { likedMovies, handleToggleLike };
}

export function useLoadMovies(movieService: MovieService, fetchFunction: () => Promise<MovieModel[]>) {
  const [movies, setMovies] = useState<MovieModel[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMovies();
  }, [page]);

  const loadMovies = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const newMovies = await fetchFunction();
      setMovies((prevMovies) => {
        const uniqueMovies = newMovies.filter(
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

  return { movies, isLoading, page, setPage };
}
