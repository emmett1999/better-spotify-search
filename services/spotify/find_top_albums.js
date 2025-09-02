const fs = require('fs').promises;
const path = require('path');

const ALBUMS_CACHE_FILE = path.resolve('local-cached-results/albumsCache.json');
const TRACK_CACHE_FILE = path.resolve('local-cached-results/tracksCache.json');

// === PUBLIC: getUserAlbums() ===
// Description: Get a list of all the user's saved albums
async function getUserAlbums(req) {

  // DEV: Check local cache json
  if(process.env.NODE_ENV === 'development') {
    const cached = await tryReadLocalCache(ALBUMS_CACHE_FILE);
    if (cached) return cached;
  }

  // 1. Session cache
  if (req.session.albums) {
    console.log("Loaded albums from session cache");
    return req.session.albums;
  }

  // 2. Verify access token is in session
  const accessToken = req.session.access_token;
  if (!accessToken) {
    throw new Error("No Spotify access token in session. User must log in.");
  }

  // 3. Fetch from Spotify
  const albums = await fetchAlbumsFromSpotify(accessToken);

  // 4. Cache in session
  req.session.albums = albums;

  // DEV: Write to local cache. At this point, albums do not exist in the cache
  if (process.env.NODE_ENV === 'development') {
    await tryWriteLocalCache(albums);
  }

  return albums;
}

// === PUBLIC: getTopUserTracks() ===
// Description: Get a list of the user's top listened-to tracks
async function getTopUserTracks(req) {

  // DEV: Check local cache json
  if(process.env.NODE_ENV === 'development') {
    const cached = await tryReadLocalCache(TRACK_CACHE_FILE);
    if (cached) return cached;
  }

  // 1. Session cache
  if (req.session.tracks) {
    console.log("Loaded tracks from session cache");
    return req.session.tracks;
  }

  // 2. Verify access token is in session
  const accessToken = req.session.access_token;
  if (!accessToken) {
    throw new Error("No Spotify access token in session. User must log in.");
  }

  // 3. Fetch from Spotify
  const tracks = await fetchTopUserTracksFromSpotify(accessToken);

  // 4. Cache in session
  req.session.tracks = tracks;

  // DEV: Write to local cache. At this point, albums do not exist in the cache
  if (process.env.NODE_ENV === 'development') {
    await tryWriteLocalCache(tracks);
  }

  return tracks;
}

async function tryReadLocalCache(cacheFile) {
  try {
    const data = await fs.readFile(cacheFile, 'utf-8');
    const cachedAlbums = JSON.parse(data);
    console.log("Loaded albums from local cache file");
    return cachedAlbums;
  } catch (err) {
    console.log("No local cache found, will fetch from Spotify...");
    return null;
  }
}

async function tryWriteLocalCache(albums) {
  try {
    await fs.writeFile(ALBUMS_CACHE_FILE, JSON.stringify(albums, null, 2));
    console.log("Local cache file updated");
  } catch (err) {
    console.error("Failed to write local cache:", err);
  }
}

async function sortAlbumsByFirstArtistName(albumInfoList) {
  albumInfoList.sort((a, b) => {
    const nameA = a.albumArtists[0]?.toLowerCase() || '';
    const nameB = b.albumArtists[0]?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });
}

async function fetchAlbumsFromSpotify(accessToken) {
  const initialUrl = 'https://api.spotify.com/v1/me/albums?offset=0&limit=50';
  let albumsResponse = await getAllAlbums(initialUrl, accessToken);
  let masterAlbumInfoList = [];

  if (!albumsResponse || !albumsResponse.items) {
    throw new Error("No albums in Spotify response");
  }

  while (true) {
    const mappedAlbums = albumsResponse.items.map(item => ({
      albumName: item.album.name,
      albumArtists: item.album.artists.map(artist => artist.name),
    }));

    masterAlbumInfoList.push(...mappedAlbums);
    // const albums = albumsResponse.items;
    // const albumInfoList = albums?.map((albumResult) => ({
    //   albumName: albumResult.album.name,
    //   albumArtists: albumResult.album.artists.map((artist) => artist.name),
    // }));

    // masterAlbumInfoList.push(...albumInfoList);

    if (!albumsResponse.next) break;
    console.debug("Next URL: " + albumsResponse.next);
    albumsResponse = await performSpotifyGetRequest(albumsResponse.next, accessToken);
  }

  console.log("Completed pulling albums from Spotify. Master album list size: %s", masterAlbumInfoList.length);

  // TODO: smove this sorting somewhere else 
  sortAlbumsByFirstArtistName(masterAlbumInfoList);

  return masterAlbumInfoList;
}

async function performSpotifyGetRequest(url, token) {
  return (await fetchWebApi(url, 'GET', token));
}

// async function getAllAlbums(url, token){
//   return (await fetchWebApi(url, 'GET', token));
// }

async function fetchWebApi(url, method, token) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    // body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

async function fetchTopUserTracksFromSpotify(accessToken) {
  const initialUrl = 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5';
  let tracksResponse = await performSpotifyGetRequest(initialUrl, accessToken);

  if (!tracksResponse || !tracksResponse.items) {
    throw new Error("No tracks in Spotify response");
  }

  const mappedTracks = tracksResponse.items.map(track => ({
      trackName: track.name,
      artists: track.artists.map(artist => artist.name),
      albumName: track.album.name,
      albumArt: track.album.images[0]?.url, // largest album cover
      spotifyUrl: track.external_urls.spotify,
      duration: track.duration_ms
  }));

  return mappedTracks;
}

module.exports = { getUserAlbums, getTopUserTracks };