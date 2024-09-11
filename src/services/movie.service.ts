import noImage from "../assets/images/no_image.jpg";
import { MovieModel } from "../models/movie.model";
import { URL_API } from "../routes/backend.route";
import { getGenreName } from "../utils/movieUtils";

export class MovieService {
  private baseUrl = URL_API.baseUrl;
  private apiKey = URL_API.apiKey;
  private language = 'fr-FR';

  constructor(language?: string) {
    if (language) {
      this.language = language;
    }
  }

  private getRandomPage(): number {
    const minPage = 1;
    const maxPage = 500;
    return Math.floor(Math.random() * (maxPage - minPage + 1)) + minPage;
  }

  private async fetchMovies(): Promise<any> {
    const randomPage = this.getRandomPage();
    const response = await fetch(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=${this.language}&page=${randomPage}`
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des films");
    }
    return response.json();
  }

  async fetchMovieById(id: number): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=${this.language}`
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du film");
    }
    return response.json();
  }

  async fetchMovieCredits(id: number): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/movie/${id}/credits?api_key=${this.apiKey}&language=${this.language}`
    );
    if (!response.ok) throw new Error("Erreur lors de la récupération des crédits");
    return response.json();
  }

  async fetchPersonById(id: number) {
    const response = await fetch(
      `${this.baseUrl}/person/${id}?api_key=${this.apiKey}&language=${this.language}`
    );
    if (!response.ok) throw new Error("Erreur lors de la récupération des détails de la personne");
    return response.json();
  }

  async fetchPersonMovieCredits(id: number) {
    const response = await fetch(
      `${this.baseUrl}/person/${id}/movie_credits?api_key=${this.apiKey}&language=${this.language}`
    );
    if (!response.ok) throw new Error("Erreur lors de la récupération des crédits de films de la personne");
    return response.json();
  }

  async fetchGenres(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=${this.language}`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des genres");
      }
      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.error("Erreur lors de la récupération des genres:", error);
      return [];
    }
  }

  async fetchMovieVideos(id: number): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/movie/${id}/videos?api_key=${this.apiKey}&language=${this.language}`
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des vidéos du film");
    }
    return response.json();
  }

  async fetchSimilarMovies(movieId: number): Promise<MovieModel[]> {
    const randomPage = this.getRandomPage();
    const response = await fetch(
      `${this.baseUrl}/movie/${movieId}/similar?api_key=${this.apiKey}&language=${this.language}&page=${randomPage}`
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des films similaires");
    }

    const data = await response.json();
    return data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      image: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : noImage,
      rating: isNaN(movie.vote_average) ? 0 : movie.vote_average / 2,
      genres: movie.genre_ids.map((genreId: number) => getGenreName(genreId)),
      description: movie.overview,
    }));
  }

  async getMoviesWithVideos(): Promise<any> {
    const data = await this.fetchMovies();

    const moviesWithVideos = await Promise.all(
      data.results.map(async (movie: any) => {
        const rating = movie.vote_average ? movie.vote_average / 2 : 0;
        const videoData = await this.fetchMovieVideos(movie.id);
        const video = videoData.results.find(
          (vid: any) => vid.type === "Trailer"
        );
        const videoUrl = video
          ? `https://www.youtube.com/watch?v=${video.key}`
          : "";

        return {
          id: movie.id,
          title: movie.title,
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : noImage,
          rating: isNaN(rating) ? 0 : rating,
          genres: movie.genre_ids.map((genreId: number) =>
            getGenreName(genreId)
          ),
          description: movie.overview,
          videoUrl,
        };
      })
    );

    return moviesWithVideos;
  }

  async searchMovies(query: string): Promise<MovieModel[]> {
    if (query.length <= 2) {
      return [];
    }

    const response = await fetch(
      `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}&language=${this.language}`
    );
    const data = await response.json();
    return data.results || [];
  }
}
