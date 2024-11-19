// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'AQDJPF4RHfo7CU843V276sVv-afkVwy-IpZp6_ZrVi7eZbJ-3g0ASAWY0lNWpK5qjNHbGlPjFTQl-1qYDHmtwMg8-1kbkjyn1gY4Ax48TWwz769wBqDaPquPFWJcLVLaq_mj6Rn063AVcWmXWteIaZvLf-sISxfkhfRnUKMhP235FaWyO8MEm05eIYDyGT_YZvgxfS66rr4jwfyfWIRDyvSOgOp4WL6Kws4tfwKt1bQ';
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
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi(
      'v1/me/albums?offset=0&limit=50', 'GET'
    ));
  }
  
async function run() {
  const topAlbums = await getAllAlbums();
    console.log(topAlbums);
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