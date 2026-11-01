import { use, useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "bcd7bb1b";

export default function Appv1() {
  const [movies, setMovies] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  function onSelectedId(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function CloseSelectedId() {
    setSelectedId(null);
  }

  function handleAddwatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  useEffect(() => {
    async function FetchingData() {
      try {
        setErrors("");
        setLoading(true);
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
        );

        if (!response.ok) {
          throw new Error("Please Check Your internet Connections");
        }
        const data = await response.json();

        if (data.Response === "False") throw new Error("Movie Not Found !");

        setMovies(data.Search);
      } catch (err) {
        setErrors(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (query.length < 3) {
      setErrors("");
      setMovies([]);
      return;
    }

    FetchingData();
  }, [query]);

  return (
    <>
      <NavBar movies={movies}>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      {/* ---------------------- */}
      <Main movies={movies}>
        {/* ============ */}

        <Box>
          {loading && <Loadings />}
          {!loading && !errors && (
            <MovieList movies={movies} onSelectedId={onSelectedId} />
          )}
          {errors && <ErrorMessage message={errors} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              CloseSelectedId={CloseSelectedId}
              onAddWatched={handleAddwatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loadings() {
  return (
    <div className="loading">
      <p>Loading...</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="ErrorMessage">
      <span>X</span> {message}
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectedId={onSelectedId} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectedId }) {
  return (
    <li onClick={() => onSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchMovie({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.Title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, CloseSelectedId, onAddWatched }) {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    Title: title,
    Plot: plot,
    Year: year,
    Poster: poster,
    Released: released,
    Runtime: runtime,
    imdbRating,
    Director: director,
    Actors: actors,
    Genre: genre,
  } = movie;

  useEffect(
    function () {
      let cancelled = false;

      async function GetDatails() {
        setLoading(true);
        if (!selectedId) return;

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
        );

        const data = await res.json();

        if (!cancelled) {
          setMovie(data);
        }
        setLoading(false);
      }

      GetDatails();

      return () => {
        cancelled = true;
      };
    },
    [selectedId],
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return () => {
        document.title = "usePopCorn";
      };
    },
    [title],
  );

  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      poster,
      title,
      imdbRating: Number(imdbRating),
      year,
      runtime: Number(runtime.split(" ").at(0)),
    };

    onAddWatched(newMovie);
    CloseSelectedId(null);
  }

  return loading ? (
    <Loadings />
  ) : (
    <div className="details">
      <header>
        <button className="btn-back" onClick={CloseSelectedId}>
          &larr;
        </button>
        <img src={poster} alt={`Poster of ${movie}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
            <span>{imdbRating} IMDb rating</span>
          </p>
        </div>
      </header>

      <section>
        <div className="rating">
          <StarRating maxRating={10} size={24} />
          <button className="btn-add" onClick={handleAdd}>
            + Add to list
          </button>
        </div>

        <p>
          <em>{plot}</em>
        </p>

        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}
