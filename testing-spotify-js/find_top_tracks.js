// {
//   access_token: 'BQDRJNxohm0TV41YUg5WTLN0aHQWVuJWaxvxsaHc0yG74EZ22pMi9AHYkx2vlWu0e4jxs8eMhAYb5n-Bvr3sFjqdzrc9GEMJoWgrE2R3k5BgKI7fclJtrMZt56X6SoVn5bOl_iyuv0u6ym8cd9BprQOn18OhrGcPtecV4gZTTTBc_kUtCd2e0vphxKyervb59aoXnQtFhLTJOnwyMJFO',
//   token_type: 'Bearer',
//   expires_in: 3600,
//   refresh_token: 'AQCk13f14vttBiSIKD0JCSfFQmo_4lmNx7v1yMCxeQVyoHrPeoaDgR73sZXsk5sM_TiFDjVsuIYfzQHZ-rFDZkxr75tnQt0gHTvcwk64MPxfpv_cC-0NfW8hdZa2_wrrBC4',
//   scope: 'user-library-read user-read-email user-read-private'
// }

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