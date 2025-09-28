import type { KeyboardEvent } from "react";
import type { Movie } from "../../types/movie";
import { getImageUrl } from "../../services/movieService";
import css from "./MovieGrid.module.css";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (movies.length === 0) return null;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, movie: Movie) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(movie);
    }
  };

  return (
    <ul className={css.grid}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <div
            className={css.card}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(movie)}
            onKeyDown={(e) => handleKeyDown(e, movie)}
            aria-label={`Open details for ${movie.title}`}
          >
            <img
              className={css.image}
              src={getImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              loading="lazy"
            />
            <h2 className={css.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}