// src/App.jsx
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import { Analytics } from "@vercel/analytics/react";

import Layout from "./components/Layout";
import HomePage from "./pages/Homepage";

// Matches
import Matches from "./pages/Matches";
import MatchDetails from "./pages/MatchDetails";

// Results
import ResultsPage from "./pages/ResultsPage";

// Movies
import Movies from "./pages/Movies";
import MoviesHome from "./pages/MoviesHome";
import MovieDetails from "./pages/MovieDetails";
import Watchlist from "./pages/Watchlist";

// Alcodist Hub
import AlcodistHub from "./pages/AlcodistHub";

//blog
import RazorBlogsLanding from "./pages/RazorBlogsLanding";
import BlogDetails from "./pages/BlogDetails";
// Author Auth
import AuthorLogin from "./pages/AuthorLogin";
import AuthorRegister from "./pages/AuthorRegister";
import AuthorProfileEdit from "./pages/AuthorProfileEdit";
import AuthorDashboard from "./pages/AuthorDashboard";
import NewBlog from "./pages/NewBlog";
import EditBlog from "./pages/EditBlog";
import AuthorProfile from "./pages/AuthorProfile";

// Not Found
import NotFound from "./pages/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      {/* Home */}
      <Route index element={<HomePage />} />

      {/* Matches */}
      <Route path="/matches" element={<Matches />} />
      <Route path="/matches/:id" element={<MatchDetails />} />

      {/* Results */}
      <Route path="/results" element={<ResultsPage />} />

      {/* Movies */}
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/home" element={<MoviesHome />} />
      <Route path="/movies/watchlist" element={<Watchlist />} />

      {/* Dynamic route for movie or TV details */}
      <Route path="/movies/home/:type/:id" element={<MovieDetails />} />
      {/* Optional route for TV shows with season/episode */}
      <Route
        path="/movies/home/:type/:id/:season/:episode"
        element={<MovieDetails />}
      />

      {/* SportGPT */}
      <Route path="/about" element={<AlcodistHub />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />

      {/* blogs */}
      <Route path="/blogs" element={<RazorBlogsLanding />} />
      <Route path="/blogs/:id" element={<BlogDetails />} />
      <Route path="/blogs/new" element={<NewBlog />} />
      <Route path="/blogs/:id/edit" element={<EditBlog />} />

      {/* Author Auth */}
      <Route path="/authors/login" element={<AuthorLogin />} />
      <Route path="/authors/register" element={<AuthorRegister />} />
      <Route path="/authors/edit/:id" element={<AuthorProfileEdit />} />
      <Route path="/authors/:id" element={<AuthorProfile />} />

      {/* Public author profile */}
      <Route path="/authors/public/:id" element={<AuthorProfile />} />

      <Route path="/authors/dashboard" element={<AuthorDashboard />} />
    </Route>
  )
);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
      <Analytics />
    </div>
  );
};

export default App;
