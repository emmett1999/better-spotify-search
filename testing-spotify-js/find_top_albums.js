// {
//   access_token: 'BQDgBQANFgXXZT1wASqHy14M4XRHSaMa0YaJofP4w69pc7OMwWmvc6G6f078Du97hvmNqE9EzQzqC0ZAPcgownN7cSizFcVtCgfd5fAsQLqG1A3VdwCAiXCtGrjMt3JuXcrFVg8KWl-ZN1RFv3by4QpxnjXg57jvbxxrwME-Bvnu_cYLuebc2ploNsnb6Rl5MxMHSL1Q1qtINO6fCCY1QiJmBQI_vBtzANmG8AfIZGgOIlHUMvfk',
//   token_type: 'Bearer',
//   expires_in: 3600,
//   refresh_token: 'AQClv7WyTqSWNAkrnZatSs4W_47ostU2qMlkbHUY9ek-XIpNT3N-3Nt8TsYxFpQeHN0GkQOr6Yh53Tnx3feeN8IRxLNieVVkoTDbURiY_7c2VbtM4W469rveQFCPmnJ1CPI',
//   scope: 'user-library-read user-read-email user-read-private'
// }

// 2025-06-24 NEW token
// {
//   access_token: 'BQDZ_NAvyqNep31YlE0kaD1Bop1YssckNFUoNOpJ1yFu2kqqy4XZvEVyJr2MnGDaPZnJXnPr5emdeOlRuhJxqnF6MXt7AeJpII-_aw_BqjfagfSoptTMl-cLgz1VUqlCiU9PC5dBW1AByxpKhVsp-6MByUc5xrRGiObPxLeBqee2eSFxU2FDaXN4i0wUcNRJkOWK9x8p-mH0TFD314CfsRGcdvksvLgkZz2ReO-crgK8eKJ9_h19',
//   token_type: 'Bearer',
//   expires_in: 3600,
//   refresh_token: 'AQDbADRuqw-vLWz17xyfh5zFm3tvvZj6TuT8kIn0Nw_7m3b_2klZIZrWpmmtHu_OUi_HIXOA67NYvWiRltXLPQNtDOc84A3o3faBJNtbtmK5fVAW8NpAlGYZpcsByTvv6m8',
//   scope: 'user-library-read user-read-email user-read-private'
// }

const token = 'BQA7Oe1n1KNK6xP6KXSWo8Uk8eN68P5pXCbjGZyoe9lS1yfJ5rCGsvGcfj3mWgBmB4crFQKTu_FMwnsNkbj2aEe-Ew5cc9-h0vu2drJTUIAF5vxcR7OOTWNQBci1D2aIHAPrKOJmdpkfMaz5BIe4Zbg8wiuO8jsCnTgfU34wYRho8vGZqEPHwdI1tHeDg5AbbqL6HU6DnZlZzd3UpOkJOT4QI2BSkQV9HS-xDuJ_tNlXBXxfURdG';
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
  
async function run() {
  const initialUrl = 'https://api.spotify.com/v1/me/albums?offset=0&limit=50';

  var albumsResponse = await getAllAlbums(initialUrl);
  if(!albumsResponse || !albumsResponse.items) {
    // console.error(new Error("No initial album response"));
    throw "No albums in Spotify response";
  }
  
  var masterAlbumInfoList = [];

  while(true) {

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
    masterAlbumInfoList.push(...albumInfoList);

    nextUrl = albumsResponse.next;
    if(!nextUrl) {
      break;
    }
    console.log("Next URL: " + nextUrl);
    albumsResponse = await getAllAlbums(nextUrl);
    // console.log("Albums response: " + albumsResponse.album);
  }

  console.log('Completed pulling albums from Spotify');
  console.log('Master album list size: %s', masterAlbumInfoList.length);

  // TODO: make a separate function for this
  // masterAlbumInfoList.sort((a, b) => {
  //   const nameA = a.albumArtists[0]?.name.toLowerCase() || '';
  //   const nameB = b.albumArtists[0]?.name.toLowerCase() || '';
  //   return nameA.localeCompare(nameB);
  // });

  // masterAlbumInfoList.forEach(album => {
  //   const artistNames = album.albumArtists.map(artist => artist.name).join(', ');
  //   console.log(`${artistNames}, ${album.albumName}`);
  // });

  console.log(masterAlbumInfoList);
  // + albumResult.album.artists.forEach((artist) => artist.name)
  // '' + albumResult.album.name + ', ' + albumResult.album.artists[0].name

  // console.log(albums);
}

// CODE EXECUTION
run();


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

