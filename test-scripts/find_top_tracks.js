
const token = 'BQBCAkiumbEM98IE2WyDyXKXwuEVOwxIGZXQn4IK_zpc8CI7paBHl7O67wP8Dv5y3MClswVs2iDqMiFa3ZGCZHFdWQN9fbuzb6F_BeZioSxS4dFC3Fgz85USeqIC52Qe2lTc_H0sM9lS1hdfNA_k9ipl9IxiMRdtFWVyEocFmmid1GcVl76wOoIrLkGmjkom8uzo0DdcjWw4fe6w5MoyrRyMaJprYIzIZnow-31Y0aQtnmG71Wp_w3CwRiWAwBJV50XwREMgPLf4';
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