const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh";

let timeout = null;

async function searchSongs(term) {
    const response = await fetch(`${apiURL}/suggest/${term}`);
    const data = await response.json();

    showData(data);
}

function showData(data) {
    // let output = "";
    // data.data.forEach(song => {
    //     output += `
    //     <li>
    //         <span><strong>${song.artist.name}</strong> - ${song.title}</span>
    //         <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    //     </li>
    //    `;
    // });

    // result.innerHTML = `
    // <ul class="songs">
    //     ${output}
    // </ul>
    // `;

    result.innerHTML = `
    <ul class="songs">
        ${data.data.map(song => `
        <li>
            <span><strong>${song.artist.name}</strong> - ${song.title}</span>
            <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
        </li>
       `).join('')}
    </ul>
    `;

    if (data.prev || data.next) {
        more.innerHTML = `
        ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
        ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;
    } else {
        more.innerHTML = "";
    }
}

async function getMoreSongs(url) {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await response.json();

    showData(data);
}


async function getLyrics(artist, songTitle) {
    const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await response.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

    result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2 >
    <span>${lyrics}</span>`;

    more.innerHTML = "";
}

search.addEventListener("keyup", e => {
    // Wait User type finish
    // Clear the timeout if it has already been set.
    // This will prevent the previous task from executing
    // if it has been less than <MILLISECONDS>
    clearTimeout(timeout);

    // Make a new timeout set to go off in 1000ms (1 second)
    timeout = setTimeout(function () {
        const searchTerm = search.value.trim();

        if (!searchTerm) {
            result.innerHTML = "";
        } else {
            searchSongs(searchTerm);
        }
    }, 1000);
});

result.addEventListener("click", e => {
    const clickedEl = e.target;

    if (clickedEl.tagName === "BUTTON") {
        const artist = clickedEl.getAttribute("data-artist");
        const songTitle = clickedEl.getAttribute("data-songtitle");

        getLyrics(artist, songTitle);
    }
});

// form.addEventListener("submit", e => {
//     e.preventDefault();

//     const searchTerm = search.value.trim();

//     if (!searchTerm) {
//         alert("Please type in a search term");
//     } else {
//         searchSongs(searchTerm);
//     }
// });