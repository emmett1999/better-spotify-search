document.addEventListener("DOMContentLoaded", async () => {
  
  // Get login status and create login button based on if user is logged in or not
  getLoginStatusAndCreateLoginButton();


  /* === PLAYER BAR ELEMENTS === */
  const playerBar = document.getElementById("player-bar");
  const trackInfo = playerBar.querySelector(".track-info");
  const playButton = playerBar.querySelector("#play-btn");
  const pauseButton = playerBar.querySelector("#pause-btn");

  /* === LOAD SPOTIFY SDK === */
  // TODO: check examples of creating Spotify SDK to see if this could be improved
  const script = document.createElement("script");
  script.src = "https://sdk.scdn.co/spotify-player.js";
  document.body.appendChild(script);

  window.onSpotifyWebPlaybackSDKReady = async () => {
    try {
      // Get token from backend
      const tokenRes = await fetch("/login/player-token");
      if (!tokenRes.ok) return console.warn("No player token");

      const { accessToken } = await tokenRes.json();

      const player = new Spotify.Player({
        name: "Better Spotify Search Player",
        getOAuthToken: cb => cb(accessToken),
        volume: 0.5
      });

      let deviceId;

      // --- ERROR HANDLERS ---
      player.addListener("initialization_error", ({ message }) => console.error(message));
      player.addListener("authentication_error", ({ message }) => console.error(message));
      player.addListener("account_error", ({ message }) => console.error(message));
      player.addListener("playback_error", ({ message }) => console.error(message));

      // --- TRACK INFO ---
      player.addListener("player_state_changed", state => {
        if (!state) return;
        const { current_track } = state.track_window;
        trackInfo.textContent = `${current_track.name} - ${current_track.artists.map(a => a.name).join(", ")}`;
      });

      // --- READY ---
      player.addListener("ready", async ({ device_id }) => {
        console.log("Player ready with Device ID:", device_id);
        deviceId = device_id;
        await transferPlaybackHere(deviceId, accessToken);

        // --- Clickable tracks on page ---
        document.querySelectorAll(".track-item").forEach(trackEl => {
          trackEl.addEventListener("click", async () => {
            const uri = trackEl.dataset.spotifyUri;
            if (!uri || !deviceId) return;
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
              method: "PUT",
              headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ uris: [uri] })
            });
          });
        });


      });

      await player.connect();

      // --- PLAY / PAUSE BUTTONS ---
      playButton.addEventListener("click", () => player.resume().catch(console.error));
      pauseButton.addEventListener("click", () => player.pause().catch(console.error));
    } catch (err) {
      console.error("Error initializing Spotify Web Player:", err);
    }

  };

});

async function getLoginStatusAndCreateLoginButton() {
  const loginButton = document.getElementById("login-btn");

  try {
    const res = await fetch("/login/status", {
      credentials: "include" // sends cookies
    });
    // TODO: verify the cookies are actually getting sent
    const data = await res.json();

    if (data.isAuthenticated) {
      console.log("User is logged in via session");
      loginButton.textContent = "Logout";
      loginButton.href = "/login/logout";
    } else {
      console.log("User is NOT logged in");
      loginButton.textContent = "Login";
      loginButton.href = "/login/authorize";
    }
  } catch (err) {
    console.error("Error checking login status:", err);
  }
}

async function transferPlaybackHere(device_id, accessToken) {
  await fetch('https://api.spotify.com/v1/me/player', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      device_ids: [device_id],
      play: false
    })
  });
}

  // TODO: ************ NEW SHIT I GOTTA VERIFY ABOVE ************