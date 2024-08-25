export interface MovieModel {
  id: number;
  title: string;
  image: string;
  rating: number;
  genres: string[];
  description: string;
  videoUrl: string;
  releaseDate: string;
  producers: string[];
  cast: string[];
}
