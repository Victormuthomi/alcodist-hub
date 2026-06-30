// src/utils/watchlist.js

export const getWatchlist = () => {
  return JSON.parse(localStorage.getItem("watchlist") || "[]");
};

export const toggleWatchlist = (item) => {
  let list = getWatchlist();
  const exists = list.find((i) => i.id === item.id);

  if (exists) {
    list = list.filter((i) => i.id !== item.id);
  } else {
    // Only save the data we need for the grid
    list.push({
      id: item.id,
      title: item.title || item.name,
      poster_path: item.poster_path,
      media_type: item.media_type || "movie", // Fallback for discover mode
    });
  }

  localStorage.setItem("watchlist", JSON.stringify(list));
  return list;
};

export const isInWatchlist = (id) => {
  return getWatchlist().find((i) => i.id === id);
};
