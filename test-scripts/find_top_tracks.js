
const accessToken = 'BQDllN9m_tX3O5V6Fe1Q_MBXiRQWktZ2vQR6ON1fjcez7tL8dmr5VfGurZc2F-6EgllvSnEtmqXxmOLVEY8LFYoUR7zidiX1GHxyYFkd6u1_cdnfqxLZR7UJY8MNtw0gwc7MXJE49FIrYnkMkmjYUa1S4unHmqSm7tMGgs6nfc62O-wzJTsS0Q_zPOsnz6QskRm1TWyK7i21AgazRxYtQPXgW5vbI6DMmSKvb_QLgqeOeEbY4wgolxnUQg';

async function run() {
  const tracks = await fetchTopUserTracksFromSpotify(accessToken);
  // console.debug("Tracks:", tracks);
  const topTracks = tracks.items.map(track => ({
    trackName: track.name,
    trackArtists: track.artists.map(a => a.name),
    albumName: track.album.name,
    albumImage: track.album.images?.[0]?.url
  }));
  console.debug("Tracks:", topTracks);
}

// const topTracks = await getTopTracks();
// console.log(topTracks);
// console.log(
//     topTracks?.map(
//         ({name, artists}) =>
//         `${name} by ${artists.map(artist => artist.name).join(', ')}`
//     )
// );

async function fetchTopUserTracksFromSpotify(accessToken) {
  const initialUrl = 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5';
  let tracksResponse = await getTopTracks(initialUrl, accessToken);

  if (!tracksResponse || !tracksResponse.items) {
    throw new Error("No tracks in top tracks response");
  }

  // console.debug("Top tracks JSON:", JSON.stringify(tracksResponse));

  return tracksResponse;
}

async function getTopTracks(url, token){
  return (await fetchWebApi(url, 'GET', token));
}

async function fetchWebApi(url, method, token) {
  // console.debug("Auth token:", token);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    // body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
}

run();