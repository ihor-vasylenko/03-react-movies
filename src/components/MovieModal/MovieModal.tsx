import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "../../types/movie";
import { getImageUrl } from "../../services/movieService";
import css from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;       
  onClose: () => void;
}

const modalRoot =
  typeof document !== "undefined"
    ? (document.getElementById("modal-root") as HTMLElement | null)
    : null;

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    if (!modalRoot) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!modalRoot) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) onClose();
  };

  const titleId = "movie-modal-title";

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>

        <img
          src={getImageUrl(movie.backdrop_path, "original")}
          alt={movie.title || "Movie backdrop"}
          className={css.image}
        />

        <div className={css.content}>
          <h2 id={titleId}>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date || "—"}
          </p>
          <p>
            <strong>Rating:</strong>{" "}
            {Number.isFinite(movie.vote_average) ? movie.vote_average.toFixed(1) : "—"}/10
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
}