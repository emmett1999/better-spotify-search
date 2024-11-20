// {
//   access_token: 'BQDrCulvuNKZM3InYLv2n2AYmuqNPDl7d4PVsk4OHmA7074y2CcbAAZdjbJbYqo4IrNCxr3s4T3wvnbraaCqgqpDXR_jgx18LbLRWvH9_0L6fWzy0iVpUr6DqrcFTs2jXJPuZoxuBp_OFpYTrnHqrp--Y_zrMphk_CziygD17Be7jzFqwQ8VvOEOahFMdapMthpTaUG4lb1ZbD44Njbz',
//   token_type: 'Bearer',
//   expires_in: 3600,
//   refresh_token: 'AQDW60VNmJVaiORF1VhTMgSuRtnQgbalx9XSo54YSNjDz9bu5LPaoz4tP7_N1KgIS2WAUACxjIQYn3bgOqVMuHnl5uVkunO1qKzEm8qMEdGA2PDmdgC8DeJ0zHmGrOpma-w',
//   scope: 'user-library-read user-read-email user-read-private'
// }

const token = 'BQBLWMpEC1xQsW8AWyQFs11AziTMqPDXhOLNechaLjkYtviC8cithzWGoptNNerRmCktovgMNNIjj5MWnV4nzbxnRFyKoub3PlAFeQa5uU9J4Yi9jYFWrvjRCfGsNogTDEPFm2aJUQcxcJczknHUJ9eGIeRog2j_lvSlrs1T6ZReig3MH7YxGDCff4DoewQ4JMDZu8xSG7LjRgw90qnB';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

async function getAllAlbums(){
    return (await fetchWebApi(
      'v1/me/albums?offset=0&limit=50', 'GET'
    ));
  }
  
async function run() {
  const albumsResponse = await getAllAlbums();
  var nextUrl = albumsResponse.next;
  console.log("Next URL: " + nextUrl);
  var albums = albumsResponse.items;
  const albumInfoList = albums?.map((albumResult) => {
    const albumInfo = {};
    albumInfo['albumName'] = albumResult.album.name;

    const albumArtists = albumResult.album.artists;
    const artistList = [];
    albumArtists.forEach((artist) => artistList.push(artist.name));
    albumInfo['albumArtists'] = artistList;
    return albumInfo;
  });
  console.log(albumInfoList);
  // + albumResult.album.artists.forEach((artist) => artist.name)
  // '' + albumResult.album.name + ', ' + albumResult.album.artists[0].name

  // console.log(albums);
}


// async function getTopTracks(){
//   // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
//   return (await fetchWebApi(
//     'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
//   )).items;
// }

// async function run() {
//     const topTracks = await getTopTracks();
//     console.log(topTracks);
//     console.log(
//         topTracks?.map(
//             ({name, artists}) =>
//             `${name} by ${artists.map(artist => artist.name).join(', ')}`
//         )
//     );
// }

run();