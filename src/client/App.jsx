import { useEffect, useState } from "react";
import "./App.css";
import MovieForm from "./components/MovieForm";
import UserForm from "./components/UserForm";

const apiUrl = "http://localhost:4000";

function App() {
  const [movies, setMovies] = useState([]);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/movie`)
      .then((res) => res.json())
      .then((res) => setMovies(res.data));
  }, []);

  const handleRegister = async ({ username, password }) => {
    const url = "http://localhost:4000/user/register";
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    };

    const res = await fetch(url, opts);
    const data = await res.json();
    console.log(data);
  };

  const handleLogin = async ({ username, password }) => {
    const url = "http://localhost:4000/user/login";
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    };

    fetch(url, opts)
      .then((res) => res.json())
      .then((data) => {
        console.log(`setting token for ${username} to ${data.token}`);
        setUserToken(data.token);
        // localStorage.setItem("token", data.data);
      });
    // alternative await version could be used instead of .then
    // const res = await fetch(url, opts);
    // const data = await res.json();
  };

  const handleCreateMovie = async ({ title, description, runtimeMins }) => {
    const url = "http://localhost:4000/movie";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ title, description, runtimeMins }),
    };
    fetch(url, opts)
      .then((res) => res.json())
      .then((data) => setMovies([...movies, data.data]));
  };

  return (
    <div className="App">
      <h1>Register</h1>
      <UserForm handleSubmit={handleRegister} />

      <h1>Login</h1>
      <UserForm handleSubmit={handleLogin} />

      <h1>Create a movie</h1>
      <MovieForm handleSubmit={handleCreateMovie} />

      <h1>Movie list</h1>
      <ul>
        {movies.map((movie) => {
          return (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <p>Description: {movie.description}</p>
              <p>Runtime: {movie.runtimeMins}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
