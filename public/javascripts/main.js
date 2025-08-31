console.log("START of main.js");

document.addEventListener("DOMContentLoaded", async () => {
  const loginBtn = document.getElementById("login-btn");

  try {
    // Ask the server if the user is logged in (based on session cookie)
    const res = await fetch("/login/status", {
      credentials: "include" // send cookies!
    });
    const data = await res.json();

    if (data.isAuthenticated) {
      console.log("User is logged in via session");
      loginBtn.textContent = "Logout";
      loginBtn.href = "/login/logout";
    } else {
      console.log("User is NOT logged in");
      loginBtn.textContent = "Login";
      loginBtn.href = "/login/authorize";
    }
  } catch (err) {
    console.error("Error checking login status:", err);
  }
});

  // // If redirected back with tokens in hash
  // if (window.location.hash) {
  //   const params = new URLSearchParams(window.location.hash.slice(1));
  //   const accessToken = params.get("access_token");
  //   const refreshToken = params.get("refresh_token");
  //   const expiresIn = params.get("expires_in");

  //   if (accessToken) {
  //     localStorage.setItem("spotify_access_token", accessToken);
  //     localStorage.setItem("spotify_refresh_token", refreshToken);
  //     localStorage.setItem("spotify_expires_in", expiresIn);

  //     // clear hash fragment from URL
  //     window.history.replaceState({}, document.title, "/");
  //   }
  // }

  // // Update button based on stored token
  // const token = localStorage.getItem("spotify_access_token");
  
  // if (token) {
  //   console.log("TEST: found cached token");
  //   loginBtn.textContent = "Logout";
  //   loginBtn.href = "#"; // prevent re-login

  //   loginBtn.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     localStorage.removeItem("spotify_access_token");
  //     localStorage.removeItem("spotify_refresh_token");
  //     localStorage.removeItem("spotify_expires_in");
  //     location.reload();
  //   });
  // } else {
  //   console.log("TEST: did not find cached token");
  //   loginBtn.textContent = "Login";
  //   loginBtn.href = "/login/authorize";
  // }


// document.addEventListener("DOMContentLoaded", () => {
//     const topAlbumsBtn = document.getElementById("top-albums-btn");
  
//     console.debug("DOMContentLoaded, constructing albums HTML");

//     let albums = [];
//     let currentPage = 1;
//     const perPage = 10;
  
//     async function fetchAlbums() {
//       const res = await fetch("/albums");
//       albums = await res.json();
//       showPage(1);
//     }
  
//     function showPage(page) {
//       currentPage = page;
//       const start = (page - 1) * perPage;
//       const end = start + perPage;
//       const pageAlbums = albums.slice(start, end);
  
//       const container = document.getElementById("albums-container");
//       container.innerHTML = "";
  
//       pageAlbums.forEach(album => {
//         const div = document.createElement("div");
//         div.textContent = `${album.albumArtists.join(", ")} - ${album.albumName}`;
//         container.appendChild(div);
//       });
  
//       renderPagination();
//     }
  
//     function renderPagination() {
//       const totalPages = Math.ceil(albums.length / perPage);
//       const paginationDiv = document.getElementById("pagination");
//       paginationDiv.innerHTML = "";
  
//       for (let i = 1; i <= totalPages; i++) {
//         const btn = document.createElement("button");
//         btn.textContent = i;
//         btn.disabled = i === currentPage;
//         btn.addEventListener("click", () => showPage(i));
//         paginationDiv.appendChild(btn);
//       }
//     }
  
//     topAlbumsBtn.addEventListener("click", fetchAlbums);
//   });
  