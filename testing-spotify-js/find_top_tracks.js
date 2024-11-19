// {
//   access_token: 'BQDRJNxohm0TV41YUg5WTLN0aHQWVuJWaxvxsaHc0yG74EZ22pMi9AHYkx2vlWu0e4jxs8eMhAYb5n-Bvr3sFjqdzrc9GEMJoWgrE2R3k5BgKI7fclJtrMZt56X6SoVn5bOl_iyuv0u6ym8cd9BprQOn18OhrGcPtecV4gZTTTBc_kUtCd2e0vphxKyervb59aoXnQtFhLTJOnwyMJFO',
//   token_type: 'Bearer',
//   expires_in: 3600,
//   refresh_token: 'AQCk13f14vttBiSIKD0JCSfFQmo_4lmNx7v1yMCxeQVyoHrPeoaDgR73sZXsk5sM_TiFDjVsuIYfzQHZ-rFDZkxr75tnQt0gHTvcwk64MPxfpv_cC-0NfW8hdZa2_wrrBC4',
//   scope: 'user-library-read user-read-email user-read-private'
// }

// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQB6gAUnbiJqTlptNAWfh9sYQV-zv60rA5xMprt0ZDzPzvNd4pcC6BueeRVCflWFQFs_RNLdEr9kvIG7qp86-3VKOBcfE51dL4br1b8HIs0MfUd714U9gjQCalqfB4OOzSqjr7Uru5TJIQn0gvV6ugNN3_kizPKgbicYxOyLbUVclT8TlfVaFRlQiPxaMDC40WJRhVm0dhRFFPRVoPYMCspeVY4pl750Ok7g4RRCFbvYo-2aOu06RrWo1GHwKc5ZsmP5RlT83FQp';
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

async function getTopTracks(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
  )).items;
}

async function run() {
    const topTracks = await getTopTracks();
    console.log(topTracks);
    console.log(
        topTracks?.map(
            ({name, artists}) =>
            `${name} by ${artists.map(artist => artist.name).join(', ')}`
        )
    );
}

run();