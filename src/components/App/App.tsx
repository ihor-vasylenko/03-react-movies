import { useState, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import css from "./App.module.css";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearchSubmit = useCallback(async (query: string) => {
    setMovies([]);
    setError(false);
    setIsLoading(true);
    try {
      const fetched = await fetchMovies({ query, page: 1 });
      if (fetched.length === 0) toast.error("No movies found for your request.");
      setMovies(fetched);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMovieSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleModalClose = () => setSelectedMovie(null);

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage />;
    if (movies.length > 0) return <MovieGrid movies={movies} onSelect={handleMovieSelect} />;
    return null;
  };

  return (
    <div className={css.container}>
      <SearchBar onSubmit={handleSearchSubmit} />
      <main className={css.main}>{renderContent()}</main>
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleModalClose} />}
      <Toaster position="top-right" />
    </div>
  );
}