console.log('Lets write javascript');
let currentsong = new Audio();
let songs;
let currfolder;

// CONVERT SECOND INTO MINUTES FOR SONG DURATION

function SecondsToMinutesSeconds(Seconds) {
    if (isNaN(Seconds) || Seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(Seconds / 60);
    const remainingSeconds = Math.floor(Seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}







async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/video84/${folder}/`)
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // SHOW ALL THE SONGS IN THE PLAYLIST
    let songul = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="music.svg" alt="">
     <div class="info">
         <div>${song.replaceAll("%20", " ")}</div>
         <div>Parmanshu</div>
     </div>
     <div class="playnow">
         <div>Playnow</div>
         <img class="invert" src="play.svg" alt="">
     </div>
     
    </li>`;

    }
    //    ATTACH AN EVENT LISTNER TO EACH SONG
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {


            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })


}
const playMusic = (track, pause = false) => {

    // let audio = new Audio("/video84/songs/" + track)
    currentsong.src = `/video84/${currfolder}/` + track;
    if (!pause) {


        currentsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}
async function main() {

    // GET ALL THE SONGS
    await getsongs("songs/ncs")

    // console.log(songs)
    playMusic(songs[0], true)







    //  ATTACH AN EVENT LISTNER TO PLAY NEXT AND PREVIOUS SONG
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg";
        } else {
            currentsong.pause();
            play.src = "play.svg";
        }
    });
    
    // play.addEventListener("click", () => {

    //     if (currentsong.paused) {
    //         currentsong.play()
    //         play.src = "pause.svg"
    //     }
    //     else
    //         currentsong.pause()
    //     play.src = " play.svg"
    // })


    // LISTEN FOR TIME UPDATE FUNCTION
    currentsong.addEventListener("timeupdate", () => {

        console.log(currentsong.currentTime, currentsong.duration);




        // Example usage
        document.querySelector(".songtime").innerHTML = `${SecondsToMinutesSeconds(currentsong.currentTime)}/${SecondsToMinutesSeconds(currentsong.duration)}`;

        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

    })

    // ADD AN EVENTLISTNER TO SEEKBAR
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration) * (percent) / 100
    })

    // ADD AN EVENT LISTNER FOR HAMBURGER
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // ADD AN EVENTLISTNER FOR CLOSE
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    // AD AN EVENTLISTNER TO previous BUTTON
    previous.addEventListener("click", () => {
        console.log("previous clicked")
        console.log(currentsong)
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })

    // AD AN EVENTLISTNER TO NEXT BUTTON

    next.addEventListener("click", () => {
        console.log("next clicked")

        console.log(songs)
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    // ADD AN EVENT TO VOLUME
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/100");
        currentsong.volume = parseInt(e.target.value) / 100;
    });


    // LOAD THE PLAYLIST WHENEVER THE CARD IS CLICK
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e)
        e.addEventListener("click", async item => {
            // console.log(item, item.currentTarget.dataset)
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)


        })
    })

    // ADD AN EVENT LISTNER FOR MUTE 

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong .volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })


}
main()

// document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
//     console.log(e, e.target, e.target.value)
//     currentsong.volume = parseInt(e.target.volume)/100
// })


// // PLAY THE FIRST SONG
//     var audio = new Audio(songs[0]);
//     audio.play();

// audio.addEventListener("loadeddata",() =>{
//     console.log(audio.duration, audio.currentSrc, audio.currentTime)
// });




