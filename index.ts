import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.API_KEY;

const fetchMovies = async (year: number, page: number = 1) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=${year}&page=${page}&sort_by=popularity.desc`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error("Could not fetch movies");
  }
};

const fetchMovieCredits = async (movieId: number) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`
    );
    return response.data.crew
      .filter((credit) => credit.known_for_department === "Editing")
      .map((credit) => credit.name);
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return [];
  }
};

const getMoviesForYear = async (year: number, page: number = 1) => {
  const movies = await fetchMovies(year, page);
  const moviesWithEditors = [];

  for (let movie of movies) {
    const editors = await fetchMovieCredits(movie.id);
    moviesWithEditors.push({
      title: movie.title,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      editors: editors,
    });
  }

  return moviesWithEditors;
};
