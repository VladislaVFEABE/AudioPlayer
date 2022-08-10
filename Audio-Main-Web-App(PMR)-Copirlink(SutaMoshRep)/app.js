
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const songTitle = $('.music-play__info marquee')
const songSinger = $('.music-play__info .song-item--singer')
const menuSide = $('.menu-side')
const btnCloseMenuSide = $('.menu-side__logo i')
const btnOpenMenuSide = $('.mobile__heading--menu')
const menuSongPlaylist = $('.menu-side__song')
const menuSongPlaylistUSUK = $('.menu-side__song.us-uk')
const menuSongPlaylistEDM = $('.menu-side__song.edm')
const personalSongPlaylist = $('.personal__song--list')
const cdThumb = $('.music-play__image')
const noteMusicAnimate = $$('.box-note-icon i')
const audio = $('#audio')
const wave = $('.music-play__left .music-play__wave')
const timeEnd = $('.music-play__progress--end')
const timeStart = $('.music-play__progress--start')
const btnPlay = $('.music-play__control .btn-toggle-play .bi-play-circle')
const btnNext = $('.music-play__control .btn-next .bi-skip-forward')
const btnPrev = $('.music-play__control .btn-prev .bi-skip-backward')
const btnRepeat = $('.music-play__control .btn-repeat')
const btnRandom = $('.music-play__control .btn-random')
const progress = $('.music-play__progress--seek .progress')
const seekbar = $('.music-play__progress--seek .seek__bar')
const seekdot = $('.music-play__progress--seek .seek__dot')
const volume = $('.music-play__volume .volume')
const iconVolume = $('.music-play__volume i')
const seekbarVolume = $('.music-play__volume .seek__bar')
const seekdotVolume = $('.music-play__volume .seek__dot')
const btnPlayAll = $('.personal__title--right button')
const themeModal = $('.theme-modal__content')
const playlistPersonal = $('.container__personal--wrapper-item .song-side__playlist--carousel.playlist')
const albumPersonal = $('.container__personal--wrapper-item .song-side__playlist--carousel.album')
const mvPersonal = $('.song-side__playlist--carousel.mv')
const singerPersonal = $('.song-side__playlist--carousel.singer')
const video = $('.playlist__mv-item--video')
const chartLegendBox = $('.chart__legend-box')

const songSide = $('.song-side')
const bannerTitle = $('.song-side__banner--title')
const bannerContent = $('.song-side__banner--content')
const heading = $('.song-side__heading')
const tabs = $$('.song-side__heading--tabs .tab-item')
const songSideContainer = $$('.song-side__container')
const songSideContainerActive = $('.song-side__container.active')
const listSlide = $$('.song__animate-img--item')
const leftScrollPlaylist = $('#left-scroll-playlist')
const rightScrollPlaylist = $('#right-scroll-playlist')
const leftScrollSinger = $('#left-scroll-singer')
const rightScrollSinger = $('#right-scroll-singer')
const carouselPlaylist = $('.song-side__playlist .song-side__playlist--carousel')
const carouselSinger = $('.song-side__singer .song-side__playlist--carousel')
const carouselNewRelease = $('.swiper__new-release .swiper-wrapper')
const btnTheme = $('.song-side__heading--theme')
const modalTheme = $('.theme-modal')
const btnCloseTheme = $('.theme-modal__heading i')
const mainPage = $('header')
const leftScrollPlaylistPersonal = $('.playlist-personal .bi-arrow-left')
const rightScrollPlaylistPersonal = $('.playlist-personal .bi-arrow-right')
const leftScrollAlbumPersonal = $('.album-personal .bi-arrow-left')
const rightScrollAlbumPersonal = $('.album-personal .bi-arrow-right')
const leftScrollMVPersonal = $('.mv-personal .bi-arrow-left')
const rightScrollMVPersonal = $('.mv-personal .bi-arrow-right')
const leftScrollSingerPersonal = $('.singer-personal .bi-arrow-left')
const rightScrollSingerPersonal = $('.singer-personal .bi-arrow-right')
const searchContainer = $('.search__result');
const searchInput = $('#search-song');

const PLAYER_STORAGE_KEY = 'MP3_DEVELOPER'
//Api
const songAPI = 'https://615950a6601e6f0017e5a15b.mockapi.io/api/songs'
//nado
const singerAPI = 'https://615950a6601e6f0017e5a15b.mockapi.io/api/singers'//Пивец
const playlistAPI = 'https://615950a6601e6f0017e5a15b.mockapi.io/api/playlist'//Плейлист
const videoAPI = 'https://615950a6601e6f0017e5a15b.mockapi.io/api/videos'//Видео
const songUSUKAPI = 'https://6260ea02f429c20deb979e8a.mockapi.io/USUK'//Название
const songEDMAPI = 'https://6260ea02f429c20deb979e8a.mockapi.io/EDM'//Название
const rankTableAPI = 'https://mp3.zing.vn/xhr/chart-realtime?songId=0&videoId=0&albumId=0&chart=song&time=-1'//
var songData = []
var singerData = []
var playlistData = []
var videoData = []
var songDataUSUK = []
var songDataEDM = []
var rankTableData = []

getData = (api) =>{
    return new Promise((resolve, reject)=>{
        var request = new XMLHttpRequest()
        request.open('GET', api)
        request.onload = () =>{
            if(request.status == 200){
                resolve(request.response)
            }
            else{
                reject(Error(request.statusText))
            }
        }
        request.onerror = ()=>{
            return Error('Fetching Data Failed')
        }
        request.send()
    })
}

Promise.all([getData(songAPI), getData(singerAPI), getData(playlistAPI), getData(videoAPI), getData(songUSUKAPI), getData(songEDMAPI), getData(rankTableAPI)])
.then(([songs, singers, playlists, videos, songsUSUK, songsEDM, ranksTable]) =>{
    songData = JSON.parse(songs)
    singerData = JSON.parse(singers)
    playlistData = JSON.parse(playlists)
    videoData = JSON.parse(videos)
    songDataUSUK = JSON.parse(songsUSUK)
    songDataEDM = JSON.parse(songsEDM)
    rankTableData = JSON.parse(ranksTable)
})
.then(()=>app.start())
.then(()=>console.log(rankTableData.data.song.length))
.catch((err)=>alert(err));

const app = {
    currentIndex : 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    isMute: false,
    isPlayPersonalSong: false,
    isPlayUSUK: false,
    isPlayEDM: false,
    configuration: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    cdThumbRotate: cdThumb.animate([
        { transform: 'rotate(360deg)'}
    ], {
        duration: 8000,
        iterations: Infinity
    }),
    swiperNewRelease: setTimeout(() => {
        new Swiper(".swiper__new-release", {
            slidesPerView: 3,
            spaceBetween: 30,
            slidesPerGroup: 3,
            loop: true,
            loopFillGroupWithBlank: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                // when window width is >= 320px
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                  slidesPerGroup: 1,
                },
                740: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                  slidesPerGroup: 2
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    slidesPerGroup: 3
                },
              },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            speed: 1000,
        })
    }, 3000),
    swiperBanner: new Swiper(".swiper__banner", {
        grabCursor: true,
        effect: "creative",
        creativeEffect: {
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        },
        loop: true,
        pagination: {
          el: '.swiper-pagination',
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        speed: 1000,
    }),
    setConfiguration: (key, value)=>{
        app.configuration[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(app.configuration))
    },
    loadConfiguration: ()=>{
        app.isRandom = app.configuration.isRandom
        app.isRepeat = app.configuration.isRepeat
        const colors = app.configuration.theme
        if(colors){
            document.documentElement.style.setProperty('--primary-bg', colors.primaryBg)
            document.documentElement.style.setProperty('--menu-side-bg', colors.menuSideBg)
            document.documentElement.style.setProperty('--music-play-bg', colors.musicPlayBg)
            document.documentElement.style.setProperty('--theme-modal-bg', colors.themeModalBg)
            document.documentElement.style.setProperty('--text-color', colors.textColor)
            document.documentElement.style.setProperty('--active-color', colors.activeColor)
            document.documentElement.style.setProperty('--none-active-color', colors.noneActiveColor)
            document.documentElement.style.setProperty('--border-layout', colors.borderLayout)
            document.documentElement.style.setProperty('--background-image', colors.backgroundImage)
            document.documentElement.style.setProperty('--sub-text-color', colors.subTextColor)
        }
    },
    defineProperties: () =>{
        Object.defineProperty(app, 'currentSong', {
            get: ()=>(songData[app.currentIndex])
        })
        Object.defineProperty(app, 'currentPlaylist', {
            get: ()=>(rankTableData.data.song[app.currentIndex])
        })
        Object.defineProperty(app, 'currentSongUSUK', {
            get: ()=>(songDataUSUK[app.currentIndex])
        })
        Object.defineProperty(app, 'currentSongEDM', {
            get: ()=>(songDataEDM[app.currentIndex])
        })
    },
    renderTheme: ()=>{
        const dataRender = themes.map((theme, index)=>{
            return `
                <div class="theme-modal__content--item" data-type="${index}">
                    <h3 class="content__item--title">${theme.type}</h3>
                    <div class="content__item--container">
                    ${theme.list.map((item, index)=>{
                        return `
                            <div class="content__item--theme" data-index="${index}">
                                <div class="item__theme--display">
                                    <img
                                        src="${item.thumbnail}"
                                        alt=""
                                    />
                                    <div class="item__theme--actions">
                                        <button class="item__theme--apply">Поменять тему</button>
                                        <button class="item__theme--preview">Отмена</button>
                                    </div>
                                </div>
                                <h4>${item.name}</h4>
                            </div>`
                    })}
                    </div>
                </div>`
        })

        let htmls = ''
        Array.from(dataRender).forEach((item, index)=>{
            htmls = htmls.concat(item.replace(/,/g, ""))
        })
        themeModal.innerHTML = htmls
    },
    renderMenuSong: ()=>{
        
        const htmls = rankTableData.data.song.map((item, index)=>{
            return `
            <div class="menu-side__song-item ${app.currentIndex === index ? 'active' : ''}" data-index="${index}">
                <div class="menu-side__song-item--number">${item.order}</div>
                <div class="menu-side__song-item--image">
                    <div class="music-play__wave active">
                        <div class="music-play__wave-item"></div>
                        <div class="music-play__wave-item"></div>
                        <div class="music-play__wave-item"></div>
                    </div>
                    <img src="https://i.pinimg.com/originals/aa/fd/fd/aafdfdca5994e9dd9742413ac1a7d20d.gif"/>
                </div>
                <div class="menu-side__song-item--info">
                    <div class="song-item--title">Phonk</div>
                    <div class="song-item--singer">Dvrst</div>
                </div>
                <div class="menu-side__song-item--play">
                    <i class="bi bi-play-circle-fill"></i>
                </div>
            </div>`
        })
        menuSongPlaylist.innerHTML = htmls.join('')
    },
    renderMenuSongUSUK: () =>{
        const htmls = songDataUSUK.map((song, index)=>{
            return `
            <div class="menu-side__song-item ${app.currentIndex === index ? 'active' : ''}" data-index="${index}">
                <div class="menu-side__song-item--number">${song.id <= 9 ? '0' + song.id : song.id }</div>
                <div class="menu-side__song-item--image">
                    <div class="music-play__wave active">
                        <div class="music-play__wave-item"></div>
                        <div class="music-play__wave-item"></div>
                        <div class="music-play__wave-item"></div>
                    </div>
                    <img src="https://sun9-west.userapi.com/sun9-37/s/v1/ig2/w6X_tYYt3mOWrZ83beNnaFjb-afe2CslbRUINT8F_woCfr5U7fmjWworgrsVFpufYowhZ6DI_dOIa5tglZYfEnqP.jpg?size=1215x2160&quality=96&type=album" />
                </div>
                <div class="menu-side__song-item--info">
                    <div class="song-item--title">Phonk</div>
                    <div class="song-item--singer">Gachi</div>
                </div>
                <div class="menu-side__song-item--play">
                    <i class="bi bi-play-circle-fill"></i>
                </div>
            </div>`
        })
        menuSongPlaylistUSUK.innerHTML = htmls.join('')
    },
    renderMenuSongEDM: () =>{
        const htmls = songDataEDM.map((song, index)=>{
            return `
            <div class="menu-side__song-item ${app.currentIndex === index ? 'active' : ''}" data-index="${index}">
                <div class="menu-side__song-item--number">${song.id <= 9 ? '0' + song.id : song.id }</div>
                <div class="menu-side__song-item--image">
                    <div class="music-play__wave active">
                        <div class="music-play__wave-item"></div>
                        <div class="music-play__wave-item"></div>
                        <div class="music-play__wave-item"></div>
                    </div>
                    <img src="https://c.tenor.com/bNPhV9IvmnkAAAAd/phonk-troll-face.gif" />
                </div>
                <div class="menu-side__song-item--info">
                    <div class="song-item--title">Phonk</div>
                    <div class="song-item--singer">Phonk</div>
                </div>
                <div class="menu-side__song-item--play">
                    <i class="bi bi-play-circle-fill"></i>
                </div>
            </div>`
        })
        menuSongPlaylistEDM.innerHTML = htmls.join('')
    },
    renderPersonalSong: ()=>{
        const personalSongList = $('.personal__song--list')
        const htmls = songData.map((song, index)=>{
            return `
                <div class="personal__song--list-item " data-index="${index}">
                  <div class="song__list-item--left">
                    <i class="bi bi-music-note-beamed"></i>
                    <div class="song__list-item--left-thumbnail">
                      <div class="music-play__wave active">
                        <div class="music-play__wave-item"></div>
                        <div class="music-play__wave-item"></div>
                        <div class="music-play__wave-item"></div>
                      </div>
                      <img src="https://c.tenor.com/bNPhV9IvmnkAAAAd/phonk-troll-face.gif" alt="#" />
                    </div>
                    <div class="list-item__left--card-info">
                      <span class="card-info__title">Разрывная</span>
                      <span class="card-info__subtitle">Тирасполь</span>
                    </div>
                  </div>
                  <div class="song__list-item--content">
                    <span>2022</span>
                  </div>
                  <div class="song__list-item--right">
                    <span>04:50</span>
                  </div>
                </div>
            `
        })
        personalSongList.innerHTML = htmls.join('')   
    },
    renderCarouselPlaylist: ()=>{
        const htmls = songData.map((song, index)=>{
            return `
            <a href="." class="playlist__carousel-item" id=${index}>
                <div class="playlist__carousel-item--img">
                    <img src="https://i1.sndcdn.com/artworks-jJRK8Kn6SIm9y8XW-ENpB8Q-t500x500.jpg"alt="#" />
                    <i class="bi bi-play-circle"></i>
                </div>
                <div class="playlist__carousel-item--title">
                    Phonk - 2022
                </div>
                <div class="playlist__carousel-item--subtitle">
                    Tiraspol
                </div>
            </a>`
        })
        carouselPlaylist.innerHTML = htmls.join('')  
    },
    renderCarouselSinger: ()=>{
        const htmls = singerData.map((singer, index)=>{
            return `
            <a class="playlist__carousel-item--circle">
            <div class="carousel-item__circle--img">
              <img
                src="https://c.tenor.com/R29fNQ7Vaf8AAAAM/phonk-skull.gif"
                alt="#"
              />
              <i class="bi bi-play-circle"></i>
            </div>
            <div class="carousel-item__circle--name">Davrst</div>
          </a>
            `
        })
        carouselSinger.innerHTML = htmls.join('')
    },
    renderNewRelease: ()=>{
        const htmls = playlistData.slice().reverse().slice(1).map((item, index)=>{
            return `
            <div class="song-side__new-release--item swiper-slide">
                <div class="song-side__new-release--thumbnail">
                    <img src="https://i.gifer.com/Mvb6.gif">
                    <i class="bi bi-play-circle"></i>
                </div>
                <div class="song-side__new-release--content">
                    <div class="new-release__info">
                        <div class="new-release__info--title">Itachi Phonk</div>
                        <div class="new-release__info--subtitle">Trash</div>
                    </div>
                    <div class="new-release__time">
                        <div class="new-release__time--rank">#${index+1}</div>
                        <div class="new-release__time--date">14.07.2022</div>
                    </div>
                </div>
            </div>
            `
        })
        carouselNewRelease.innerHTML = htmls.join('')
    },
    renderPlaylistPersonal: ()=>{
        const htmls = playlistData.map((playlist, index)=>{
            return `
            <a href="." class="playlist__carousel-item" id=${index}>
                <div class="playlist__carousel-item--img">
                    <img src="https://c.tenor.com/wgV5tVDd24QAAAAM/konosuba-dance.gif" alt="#" />
                    <i class="bi bi-play-circle"></i>
                </div>
                <div class="playlist__carousel-item--title">
                    Kazuma  Flex
                </div>
                <div class="playlist__carousel-item--subtitle">
                   Phonk
                </div>
            </a>`
        })
        playlistPersonal.innerHTML = htmls.join('')  
    },
    renderAlbumPersonal: ()=>{
        const htmls = playlistData.slice().reverse().map((playlist, index)=>{
            return `
            <a href="." class="playlist__carousel-item" id=${index}>
                <div class="playlist__carousel-item--img">
                    <img  src="https://sun9-east.userapi.com/sun9-76/s/v1/ig2/JBKLPmSQPworD-O1rSdwD3T3TOxwVKLDH49D6sjQXJ8NttdMEKwTuIi9MeVcVZB6BFQJKtGaYMK6nZYwOyFHUK6F.jpg?size=1280x1280&quality=95&type=album" alt="#" />
                    <i class="bi bi-play-circle"></i>
                </div>
                <div class="playlist__carousel-item--title">
                    Phonk
                </div>
            </a>`
        })
        albumPersonal.innerHTML = htmls.join('')  
    },
    renderSearchResult: (data) =>{
        const htmls = data.map((item, index)=>{
            return `
            <a href="#${index}" class="search__result--item">
              <div class="result__item--img">
                <img src="https://sun9-north.userapi.com/sun9-81/s/v1/ig2/gHHq0ODzEkLdhUw2AHzhC1hOp6BwDat1ndhQoENbka14iakF-xiHHn3j35m_TMRX90qTzUbYkcBVNcXlIPvvmeby.jpg?size=1334x1800&quality=96&type=album" alt="Song Image">
              </div>
              <div class="result__item--content">
                <h3 class="content__title">
                 Phonk
                </h3>
                <h4 class="content__subtitle">
                    DVRST
                </h4>
              </div>
            </a>`
        })
        searchContainer.innerHTML = htmls.join('')  
    },
    onSearch: ()=>{
        
        searchInput.addEventListener('keyup', (e)=>{
          
            if(searchInput.value.trim().length > 0){
                searchContainer.style.display = 'flex'
                var dataRender = app.handleSearch(e.target.value, rankTableData.data.song)
                app.renderSearchResult(dataRender)
            }
            else{
                searchContainer.style.display = 'none'
            }
        })
        songSide.onclick = () =>{
            searchContainer.style.display = 'none'
        }
    
        
    },
    start: ()=>{
        app.onSearch()
        app.loadConfiguration()
        app.defineProperties()
        app.renderTheme()
        app.renderMenuSong()
        app.renderMenuSongUSUK()
        app.renderMenuSongEDM()
        app.renderPersonalSong()
        app.renderCarouselPlaylist()
        app.renderCarouselSinger()
        app.renderNewRelease()
        app.renderPlaylistPersonal()
        app.renderAlbumPersonal()
        app.renderMVPersonal()
        app.renderZingChart()
        app.loadCurrentSong()
        app.loadZingChart()
        app.handleEvent()
        app.selectTheme()
        app.selectSongPlaylist()
        app.selectSongPlaylistUSUK()
        app.selectSongPlaylistEDM()
        app.selectSongPersonal()
        app.handleHoverVideo()
    }
}

/*-----SCROLL MAINPAGE-----*/
songSide.onscroll = (e) =>{
    heading.classList.toggle('sticky', e.target.scrollTop > 0)
    bannerTitle.classList.toggle('fade-out', e.target.scrollTop > 0)
    bannerContent.classList.toggle('fade-out', e.target.scrollTop > 0)
}

/*-----TAB SELECTED MAINPAGE-----*/
tabs.forEach((tab, index)=>{
    const songSideContainerItem = songSideContainer[index]
    tab.onclick = () => {
        $('.song-side__heading--tabs .tab-item.active').classList.remove('active')
        $('.song-side__container.active').classList.remove('active')
        tab.classList.add('active')
        songSideContainerItem.classList.add('active')
    }
});

/*-----Auto Slideshow-----*/
let index = 2
showSlides = () =>{
    const slideFirst = $('.song__animate-img--item.first')
    const slideSecond = $('.song__animate-img--item.second')
    const sildeThird = listSlide[index === listSlide.length - 1 ? 0 : index+1]
    slideFirst.classList.replace('first', 'third')
    slideSecond.classList.replace('second', 'first')
    sildeThird.classList.replace('third', 'second')
    index++
    if(index >= listSlide.length){
        index = 0
    }
    setTimeout(showSlides, 2000)
}
showSlides()

/*-----Handle button arrow-----*/
leftScrollPlaylist.onclick = () => carouselPlaylist.scrollLeft -= 300
rightScrollPlaylist.onclick = () => carouselPlaylist.scrollLeft += 300
leftScrollSinger.onclick = () => carouselSinger.scrollLeft -= 300
rightScrollSinger.onclick = () => carouselSinger.scrollLeft += 300
leftScrollPlaylistPersonal.onclick = () => playlistPersonal.scrollLeft -= 300
rightScrollPlaylistPersonal.onclick = () => playlistPersonal.scrollLeft += 300
leftScrollAlbumPersonal.onclick = () => albumPersonal.scrollLeft -= 300
rightScrollAlbumPersonal.onclick = () => albumPersonal.scrollLeft += 300
leftScrollMVPersonal.onclick = () => mvPersonal.scrollLeft -= 400
rightScrollMVPersonal.onclick = () => mvPersonal.scrollLeft += 400
leftScrollSingerPersonal.onclick = () => singerPersonal.scrollLeft -= 300
rightScrollSingerPersonal.onclick = () => singerPersonal.scrollLeft += 300

/*-----Handle Click Menu Setting-----*/
btnTheme.onclick = () =>{
    modalTheme.style.display = 'block'
    mainPage.style.filter = 'brightness(50%)'
}
btnCloseTheme.onclick = () => {
    modalTheme.style.display = 'none'
    mainPage.style.filter = 'brightness(100%)'
}

/*-----TAB SELECTED PERSONAL-----*/
const tabsPersonal = $$('.personal__navbar-item')
const tabsContentPersonal = $$('.container__personal--wrapper-item')

tabsPersonal.forEach((tab, index)=>{
    const tabContent = tabsContentPersonal[index-1]
    const gridContainer = $$('.container__personal--wrapper-item .song-side__playlist--carousel')
    const arrowPersonal = $$('.container__personal--control .personal__title--right')
    tab.onclick = () =>{
        if(index == 0){
            $('.personal__song--animate').style.display='block'
            $('.personal__song--list').style.width = 'auto'
            $('.personal__song--list').style.overflow = 'hidden'
            $('.personal__song--list').style.overflowY = 'auto'
            $('.container__personal--wrapper-item.active').classList.remove('active')
            $$('.container__personal--wrapper-item').forEach((item)=>{
                item.classList.add('active')
            })
            Array.from(gridContainer).forEach((item, index)=>{
                item.style.display = 'flex'
                item.style.gridTemplateColumns = 'unset'
                item.style.gridGap= '0px'
            })
            Array.from(arrowPersonal).forEach((item, index)=>{
                item.style.display = 'block'
            })
        }
        else{
            if(index == 1){
                $('.personal__song--animate').style.display='none'
                $('.personal__song--list').style.width = '100%'
                $('.personal__song--list').style.overflow = 'unset'
                $('.personal__song--list').style.overflowY = 'unset'
            }
            $$('.container__personal--wrapper-item.active').forEach((item)=>{
                item.classList.remove('active')
            })
            
            tabContent.classList.add('active')
            Array.from(gridContainer).forEach((item, index)=>{
                if(item.classList.contains('mv')){
                    item.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))'          
                }
                else{
                    
                    item.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr))'
                }
                item.style.display = 'grid'
                item.style.gridGap= '20px'
                
            })

            Array.from(arrowPersonal).forEach((item, index)=>{
                item.style.display = 'none'
            })
        }
        $('.personal__navbar-item.active').classList.remove('active')
        tab.classList.add('active')
        
    }
})

/*-----TAB SELECTED MENU SONG-----*/
const menuPlaylist = $$('.menu-side__playlist h4')
const menuSideSong = $$('.menu-side__song')
menuPlaylist.forEach((menu, index)=>{
    const side = menuSideSong[index]
    menu.onclick = () =>{
        $('.menu-side__playlist h4.active').classList.remove('active')
        $('.menu-side__song.active').classList.remove('active')
        menu.classList.add('active')
        side.classList.add('active')
    }
})


/*-----RESPONSIVE-----*/
btnOpenMenuSide.onclick = () => {
    menuSide.style.width = '100%'
    menuSide.style.display = 'block'
}
btnCloseMenuSide.onclick = () => {
    menuSide.style.display = 'none'
}


const jsonmusik = [
    {
        name: "Lost in the Fire",
        singer: "Gesaffelstein, The Weeknd",
        thumbnail: "https://sun9-east.userapi.com/sun9-17/s/v1/if2/IaVaLcNo-VCrz9dvAule2ta6VnWbOAK_2StShGjimw6P534M62BZtEObi9GunOCbce7cm2s5vU1mL18VdU1k52u5.jpg?size=1472x1472&quality=95&type=album",
        album: "none(album)",
        path: "https://vangiau-cover.vercel.app/mp3/TapCoDon.mp3",
        id: "1"
    },
    {
        name: "Frozen",
        singer: "Madonna, Sickick",
        thumbnail: "https://sun9-west.userapi.com/sun9-39/s/v1/if2/e6HsizOkcYoUtZDfyNm1Z-tISp1Nza_isBNwmAeqx7C0e9I7IwK8MyFhqZ1wrV71bWlq8djNLnU1ETOqdNF4qvDi.jpg?size=1474x1472&quality=95&type=album",
        album: "New 2022",
        path: "https://vangiau-cover.vercel.app/mp3/HoaBangLangRemix.mp3",
        id: "2"
    },
    {
        name: "GANGSTER Flip Trap Mix",
        singer: "DJariium",
        thumbnail: "https://sun9-east.userapi.com/sun9-43/s/v1/if2/b-oV9aI09aWcTJuNjdZe7JA55GgvU2AIqDBOlnb5S0Lwqf0wlC6h5-MO3qKQSiSr0z-C8fAkwsy0ywq0i-vXur7j.jpg?size=1440x1430&quality=95&type=album",
        album: "Single",
        path: "https://vangiau-cover.vercel.app/mp3/CauHenCauThe.mp3",
        id: "3"
    },
    {
        name: "One Kiss",
        singer: "Calvin Harris, Dua Lipa",
        thumbnail: "https://sun9-east.userapi.com/sun9-24/s/v1/if2/Mberaz-lVTiKKtZDD68qn0vxjOiRt1IVvz2KrZGDfDe_kKpCzsL2FjF2nH67QZKbWLmiBMZ1kpe_qZH2xuzM9dTu.jpg?size=1472x1472&quality=95&type=album",
        album: "Trúc Xinh (Single)",
        path: "https://vangiau-cover.vercel.app/mp3/TrucXinh.mp3",
        id: "4"
    },
    {
        name: "На моём аккаунте",
        singer: "KIZARU",
        thumbnail: "https://sun9-north.userapi.com/sun9-82/s/v1/ig2/7ODMH-G98mFTkhzhK8EsK5bjZlZ3UJ5lEZvwsGpTKSVuj4pHL0fTLm1NI-pTJqdQv3LqNhTMOqLGw6XLOIEr4IV9.jpg?size=1170x1152&quality=95&type=album",
        album: "None",
        path: "https://vangiau-cover.vercel.app/mp3/DungNoiLoiChiaTayKhiEmVanConYeu.mp3",
        id: "5"
    },
    {
        name: "Royalty",
        singer: "Egzod, Maestro Chives, Ne",
        thumbnail: "https://sun9-west.userapi.com/sun9-52/s/v1/ig2/WQFZb46KnC1qjfSVXeMFJe70TVTaryMu1NXtMLrHetc0i7h-iHAiCyaEoIexLBeIh7jhWo0VE4XfYUfRNmWlZ19J.jpg?size=1080x1080&quality=95&type=album",
        album: "None",
        path: "https://vangiau-cover.vercel.app/mp3/EmKhongSaiChungTaSai.mp3",
        id: "6"
    },
    {
        name: "Disaster",
        singer: "KSLV Noh",
        thumbnail: "https://vangiau-cover.vercel.app/img/TinhAnh.jpg",
        album: "None",
        path: "https://vangiau-cover.vercel.app/mp3/TinhAnh.mp3",
        id: "7"
    },
    {
        name: "Override",
        singer: "KSLV Noh",
        thumbnail: "https://sun9-east.userapi.com/sun9-43/s/v1/if2/c8OjY1Qgo4DuiR_WMs5VF2BwCEhx9K5CFVA0cHmOXFxtqZ7P1Fgi9qC_bqVXL_5dFJ0BpFoVfXL8V5y5YUQEG9V0.jpg?size=1600x1600&quality=95&type=album",
        album: "None",
        path: "https://vangiau-cover.vercel.app/mp3/AoCuTinhMoi.mp3",
        id: "8"
    },
    {
        name: "Russia Vip",
        singer: "SXGXVX",
        thumbnail: "https://sun9-east.userapi.com/sun9-75/s/v1/ig2/fFFPhucH90X5KcEptdedOQtTLbXOn08_Nn-0VC1EDZGwyg8sJwPEVRt0r0mN-6PNDZ7p7krnr6NHcFGtLweAjnvI.jpg?size=1130x1280&quality=96&type=album",
        album: "None",
        path: "https://vangiau-cover.vercel.app/mp3/ThichThiDen.mp3",
        id: "9"
    },
    {
        name: "Stay With Me",
        singer: "1nonly",
        thumbnail: "https://sun9-north.userapi.com/sun9-85/s/v1/ig2/rYcztAW8Hnf2mqAbYkvsAqgf34YM6a6cx2RrxN9Kt3SqnTEJFhhHZLY90h5o4vnv_ZUb3r7cAd6sBvtBeHTH2fWP.jpg?size=750x750&quality=95&type=album",
        album: "None",
        path: "https://vangiau-cover.vercel.app/mp3/YeuMotNguoiTonThuong.mp3",
        id: "10"
    },
    {
        name: "Sahara",
        singer: "Hensonn",
        thumbnail: "https://sun9-north.userapi.com/sun9-84/s/v1/if2/7_h63YXYHIlvoZelycLnr9nb0F1_ade4D6ClehP1V6qo277vIimlygrRuZKs3jWZ_DqjeRtlVd0BmHdGQ6gfK1Oj.jpg?size=1280x1280&quality=95&type=album",
        album: "None",
        path: "https://vangiau-cover.vercel.app/mp3/ViAnhThuongEm.mp3",
        id: "11"
    },
    {
        name: "Espada",
        singer: "roseboi",
        thumbnail: "https://sun9-north.userapi.com/sun9-79/s/v1/ig2/1T9JuSkPgGKjpNfpEQ34SO_ZAIe4fUvAwuKbllrpIYw9wGm2p32Sod-zBltG4YJbfDMP8RRnUB-tlQwMpmpps4YS.jpg?size=1080x1080&quality=95&type=album",
        album: "none",
        path: "https://vangiau-cover.vercel.app/mp3/BucTranhYeuThuong.mp3",
        id: "12"
    },
    {
        name: "IN THE CLUB",
        singer: "Mishashi Sensei",
        thumbnail: "https://sun9-west.userapi.com/sun9-48/s/v1/if2/EX4ZY6kOfBOWLZzSHW180fPIzVvsjNSOZZEi8dURqCN1J1gizaGqOxJ0PXk921mJWX9pPlCrC57eGXQkbwGW84nL.jpg?size=1280x1280&quality=95&type=album",
        album: "None",
        path: "http://api.mp3.zing.vn/api/streaming/audio/ZZ9DI6FU/320",
        id: "13"
    }
];


