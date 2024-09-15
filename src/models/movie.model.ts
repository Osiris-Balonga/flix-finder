export interface MovieModel {
  id: number;
  title: string;
  image: string;
  rating: number;
  genres: string[];
  description: string;
  runtime?: number;
  videoUrl: string;
  releaseDate: string;
  producers: string[];
  cast: string[];
}
