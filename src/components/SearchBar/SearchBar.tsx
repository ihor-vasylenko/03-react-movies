import { useRef, useActionState } from "react";
import toast from "react-hot-toast";
import css from "./SearchBar.module.css";

interface SearchBarProps {
  onSubmit: (query: string) => void | Promise<void>;
}

type FormState = null;

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (_prev: FormState, fd: FormData): Promise<FormState> => {
    const q = ((fd.get("query") as string) ?? "").trim();

    if (!q) {
      toast.error("Please enter your search query.");
      return null; 
    }

    await onSubmit(q);
    return null;
  };

  const [, action, pending] = useActionState<FormState, FormData>(handleAction, null);

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form ref={formRef} className={css.form} action={action}>
          <input
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
            aria-label="Search movies"
            disabled={pending}
          />
          <button className={css.button} type="submit" disabled={pending}>
            {pending ? "Searching..." : "Search"}
          </button>
        </form>
      </div>
    </header>
  );
}

