const fs = require('fs').promises;
const path = require('path');

const CACHE_FILE = path.resolve('./albumCache.json');
const token = 'token';

// CODE EXECUTION
// run();

// FUNCTIONS
async function getUserAlbums() {
  let masterAlbumInfoList;

  console.log("TESTING LOGGING");

  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    masterAlbumInfoList = JSON.parse(data);
    console.log("Loaded albums from cache");
  } catch (error) {
    console.log("No cache found, fetching from Spotify...");
    try {
      masterAlbumInfoList = await fetchAlbumsFromSpotify();
      await fs.writeFile(CACHE_FILE, JSON.stringify(masterAlbumInfoList, null, 2));
      console.log("Cache saved");
    } catch (fetchErr) {
      console.error("Failed to fetch albums from Spotify:", fetchErr);
      return [];
    }
  }

  console.log("Retrieved %s albums from Spotify", masterAlbumInfoList.length);

  console.log("Sorting albums by first artist name");
  await sortAlbumsByFirstArtistName(masterAlbumInfoList);

  return masterAlbumInfoList;
}

async function sortAlbumsByFirstArtistName(albumInfoList) {
  albumInfoList.sort((a, b) => {
    const nameA = a.albumArtists[0]?.toLowerCase() || '';
    const nameB = b.albumArtists[0]?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });
}

async function fetchAlbumsFromSpotify() {
  const initialUrl = 'https://api.spotify.com/v1/me/albums?offset=0&limit=50';
  var albumsResponse = await getAllAlbums(initialUrl);
  let masterAlbumInfoList = [];

  if(!albumsResponse || !albumsResponse.items) {
    // console.error(new Error("No initial album response"));
    throw "No albums in Spotify response";
  }

  while(true) {
    const albums = albumsResponse.items;
    const albumInfoList = albums?.map((albumResult) => ({
      albumName: albumResult.album.name,
      albumArtists: albumResult.album.artists.map((artist) => artist.name)
    }));

    masterAlbumInfoList.push(...albumInfoList);

    if (!albumsResponse.next) break;
    console.log("Next URL: " + albumsResponse.next);
    albumsResponse = await getAllAlbums(albumsResponse.next);
  }

  console.log('Completed pulling albums from Spotify');
  console.log('Master album list size: %s', masterAlbumInfoList.length);

  return masterAlbumInfoList;
}

async function fetchWebApi(url, method, body) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

async function getAllAlbums(url){
  return (await fetchWebApi(url, 'GET'));
}

module.exports = { getUserAlbums };