

async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      scope: 'user-read-private user-read-email'
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

const client_id = 'xxxxxxxxxxxxxxx';
const client_secret = 'xxxxxxxxxxxxxxx';

async function getAuthToken() {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      scope: 'user-read-private user-read-email'
    },
    method
  });
  return await res.json();
}
  
async function run() {
  getAuthToken();
}



run();