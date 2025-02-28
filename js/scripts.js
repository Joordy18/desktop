let progress = document.getElementById('progress');
let song = document.getElementById('song');
let ctrlIcon = document.getElementById('ctrlIcon');

song.onloadedmetadata = function(){
    progress.max = song.duration;
    progress.value = song.currentTime;
}

function playPause(){
    if (ctrlIcon.classList.contains('fa-pause')){
        song.pause();
        ctrlIcon.classList.remove('fa-pause');
        ctrlIcon.classList.add('fa-play');
    } else {
        song.play();
        ctrlIcon.classList.add('fa-pause');
        ctrlIcon.classList.remove('fa-play');
    }
}

if (song.play()){
    setInterval(()=>{
        progress.value = song.currentTime;
    },500);
}

progress.onchange = function(){
    song.play();
    song.currentTime = progress.value;
    ctrlIcon.classList.add('fa-pause');
    ctrlIcon.classList.remove('fa-play');
}

const songs = [
    {
        title: "Everybody Wants To Rule The World",
        artist: "Tears For Fears",
        src: "sources/mp3/Everybody%20Wants%20To%20Rule%20The%20World.mp3",
        img: "sources/img/mp3pics/Everybody%20Wants%20To%20Rule%20The%20World.jpg"
    },
    {
        title: "Hit in the USA",
        artist: "Beat Crusaders",
        src: "sources/mp3/Hit%20in%20the%20USA.mp3",
        img: "sources/img/mp3pics/Hit%20in%20the%20USA.jpg"
    },
    {
        title: "Mort ce Soir",
        artist: "Josman",
        src: "sources/mp3/Mort%20ce%20soir.mp3",
        img: "sources/img/mp3pics/Mort%20ce%20soir.jpg"
    },
    {
        title: "Out of Touch",
        artist: "Daryl Hall & John Oates",
        src: "sources/mp3/Out%20of%20Touch.mp3",
        img: "sources/img/mp3pics/Out%20of%20Touch.jpg"
    },
    {
        title: "Under your Spell",
        artist: "Snow Strippers",
        src: "sources/mp3/Under%20your%20spell.mp3",
        img: "sources/img/mp3pics/Under%20your%20spell.jpg"
    },
    {
        title: "We are the People",
        artist: "Empire of the Sun",
        src: "sources/mp3/We%20are%20the%20People.mp3",
        img: "sources/img/mp3pics/We%20are%20the%20People.jpg"
    }
];

let currentSongIndex = 0;

function loadSong(index) {
    const song = songs[index];
    document.querySelector('.song-img').src = song.img;
    document.querySelector('.music-player h1').innerText = song.title;
    document.querySelector('.music-player p').innerText = song.artist;
    document.getElementById('song').src = song.src;
    document.getElementById('song').load();
    playPause();
}

document.querySelector('.fa-forward').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    playPause();
});

document.querySelector('.fa-backward').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    playPause();
});

song.addEventListener("ended", function () {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    playPause();
});

document.querySelectorAll('.closeBtn').forEach(button => {
    button.addEventListener('click', (event) => {
        const smallWindow = event.target.closest('.small-window');
        smallWindow.style.display = 'none';
        removeTaskbarIcon(smallWindow.id);
        if (smallWindow.id === 'smallWindow-mp3') {
            song.pause();
            ctrlIcon.classList.remove('fa-pause');
            ctrlIcon.classList.add('fa-play');
        }
    });
});

document.querySelectorAll('.close-icon').forEach(icon => {
    icon.addEventListener('click', (event) => {
        const smallWindow = event.target.closest('.small-window');
        smallWindow.style.display = 'none';
        removeTaskbarIcon(smallWindow.id);
        if (smallWindow.id === 'smallWindow-mp3') {
            song.pause();
            ctrlIcon.classList.remove('fa-pause');
            ctrlIcon.classList.add('fa-play');
        }
    });
});

let volume = document.getElementById('volume');
document.getElementById('volume').addEventListener('input', (event) => {
    const volume = event.target.value;
    document.getElementById('song').volume = volume;
});

loadSong(currentSongIndex);

document.querySelectorAll('.folder').forEach(folder => {
    folder.addEventListener('click', () => {
        const folderName = folder.getAttribute('data-folder');
        const smallWindow = document.getElementById(`smallWindow-${folderName}`);
        minimizeAllWindows();
        if (smallWindow.style.display !== 'block') {
            smallWindow.style.display = 'block';
            if (!taskbarIcons.querySelector(`button[data-window="smallWindow-${folderName}"]`)) {
                addTaskbarIcon(folder, folderName);
            }
            makeDraggable(smallWindow);
            if (folderName === 'gallery') {
                loadGalleryImages();
            }
        }
    });
});

function loadGalleryImages() {
    const galleryContent = document.getElementById('galleryContent');
    galleryContent.innerHTML = ''; // Clear existing content
    for (let i = 1; i <= 20; i++) {
        const img = document.createElement('img');
        img.src = `sources/img/gallerypics/${i}.jpg`;
        galleryContent.appendChild(img);
    }
}

document.querySelectorAll('.closeBtn').forEach(button => {
    button.addEventListener('click', (event) => {
        const smallWindow = event.target.closest('.small-window');
        smallWindow.style.display = 'none';
        removeTaskbarIcon(smallWindow.id);
    });
});

document.querySelectorAll('.minimizeBtn').forEach(button => {
    button.addEventListener('click', (event) => {
        const smallWindow = event.target.closest('.small-window');
        smallWindow.style.display = 'none';
    });
});

const taskbarIcons = document.getElementById('taskbarIcons');

function addTaskbarIcon(folder, folderName) {
    const taskbarIcon = document.createElement('button');
    taskbarIcon.setAttribute('data-window', `smallWindow-${folderName}`);
    const icon = folder.querySelector('img').cloneNode();
    taskbarIcon.appendChild(icon);
    taskbarIcon.appendChild(document.createTextNode(` ${folderName}`));
    taskbarIcon.addEventListener('click', () => {
        const smallWindow = document.getElementById(`smallWindow-${folderName}`);
        smallWindow.style.display = 'block';
        taskbarIcon.remove();
    });
    taskbarIcons.appendChild(taskbarIcon);
}

function removeTaskbarIcon(smallWindowId) {
    const taskbarIcon = taskbarIcons.querySelector(`button[data-window="${smallWindowId}"]`);
    if (taskbarIcon) {
        taskbarIcon.remove();
    }
}

function makeDraggable(element) {
    const header = element.querySelector('.window-header');
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

    header.onmousedown = (e) => {
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    };

    function elementDrag(e) {
        e.preventDefault();
        offsetX = mouseX - e.clientX;
        offsetY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        element.style.top = (element.offsetTop - offsetY) + "px";
        element.style.left = (element.offsetLeft - offsetX) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function minimizeAllWindows() {
    document.querySelectorAll('.small-window').forEach(window => {
        window.style.display = 'none';
    });
}

options = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric'
};
const clock = () => dateTime.innerText = new Intl.DateTimeFormat('en-EN', options).format(new Date());
clock();
setInterval(clock, 1000);

function enableImagePreview() {
    const galleryContent = document.getElementById('galleryContent');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');

    galleryContent.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            lightboxImg.src = event.target.src;
            lightbox.style.display = 'flex';
        }
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
}

document.addEventListener("DOMContentLoaded", enableImagePreview);

document.querySelectorAll('.close-icon').forEach(icon => {
    icon.addEventListener('click', (event) => {
        const smallWindow = event.target.closest('.small-window');
        smallWindow.style.display = 'none';
        removeTaskbarIcon(smallWindow.id);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById('loginButton');
    const loginScreen = document.getElementById('loginScreen');
    const mainContent = document.getElementById('mainContent');
    const taskbar = document.getElementById('taskbar');

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            if (loginScreen) loginScreen.style.display = 'none';
            if (mainContent) {
                mainContent.style.display = 'block';
                mainContent.classList.add('fadeIn');
            }
            if (taskbar) taskbar.style.display = 'flex';
        });
    }
});