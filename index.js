const template = document.createElement('template')
template.innerHTML = `
        <style>
            * {
                padding: 0;
                margin: 0;
                box-sizing: border-box
            }
            .video-player {
                background-color: black;
                margin-inline: auto;
                position: relative;

            }
            video {
                display: block;
                height: 100%;
                max-width:100%;
                background-color: black;
                margin-inline: auto;
            }
            .video-player-controls {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0.25rem;
                padding-inline: 1rem;
                height: 2rem;
                z-index: 10;
                color: white;
                transition: opacity 150ms ease-in-out;
                display: flex;
                align-items: center ;
            }
            .video-player-controls button {
                cursor: pointer;
                color: inherit;
                margin-inline: 0.2rem;
                background-color: transparent;
                border: none;
            }
            .video-player-controls button.controls__mini-player-btn {
                margin-left: auto;
            }
            .controls__timeline-bar {
                position: absolute;
                left: 0;
                bottom: 2.5rem;
                right: 0;
                height: 0.5rem;
                margin-inline: 1rem;
                z-index: 20;
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            .controls__timeline-bar:hover .timeline {
            }
            .controls__timeline-bar .timeline {
                background-color: rgba(100, 100, 100, 0.5);
                height: 4px;
                width: 100%;
                overflow:hidden;
                border-radius: 10px;
                position: relative;
            }
            .controls__timeline-bar .timeline .buffer {
                position: absolute;
                left: 0;
                bottom: 0;
                top: 0;
                width: var(--buffer-position);
                background-color: lightgray;
            }
            .controls__timeline-bar .timeline::before {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: calc(100% - var(--preview-position) * 100%);
                background-color: rgb(150, 150, 150);
                display: none;
            }
            .controls__timeline-bar .timeline::after {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: calc(100% - var(--progress-position) * 100%);
                background-color: #2193ff;
            }
            .controls__timeline-bar .thumb-indicator {
                --scale:1;
                position: absolute;
                transform: translateX(-50%) scale(var(--scale));
                height: 200%;
                top: -50%;
                left: calc(var(--progress-position) * 100%);
                background-color:  rgba(0,0,0 ,0.9) ;
                border: 2px solid #2193ff;
                border-radius: 50%;
                transition: trasform 150ms ease-in-out;
                aspect-ratio: 1/1;
            }

            .controls__timeline-bar:hover .timeline::before {
                display: block;
            }


            .video-player.paused .pause-icon {
                display: none;
            }
            .video-player:not(.paused) .play-icon {
                display: none;
            }
            
            .video-player.full-screen-mode .fullscreen-icon {
                display: none ;
            }
            .video-player:not(.full-screen-mode) .exit-fullscreen-icon {
                display: none ;
            }


            .controls__volume-bar {
                width: 100px;
                height: 4px ;
                margin-inline: 10px;
                background-color: rgba(100, 100, 100, 0.5);
                position: relative;
                cursor: pointer;
            }

            .controls__volume-bar::before {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;  
                width: calc(var(--volume , 0.9) * 100%);
                background-color:  #2193ff ;
            }

            .controls__volume-bar .thumb-indicator {
                position: absolute;
                transform: translateX(-50%);
                height: 200%;
                top: -50%;
                left: calc(var(--volume , 0.9) * 100%);
                background-color: white ;
                border-radius: 50%;
                transition: trasform 150ms ease-in-out;
                aspect-ratio: 1/1;
            }

            .time-container {
                margin-inline: 10px
            }

         </style>
         <div class="video-player paused">
            <div class="video-player-controls">
                <div class="controls__timeline-bar">
                    <div class="timeline">
                        <div class="buffer"></div>
                        </div>
                        <div class="thumb-indicator"></div>
                </div>
                <button class="controls__fast-rewind-btn">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 15.8603L19.25 18.25V5.75L16 8.13971"/>
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.75 12L13.25 5.75V18.25L4.75 12Z"/>
                    </svg>
                </button>
                <button class="controls__play-pause-btn">
                    <span class="play-icon">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.25 12L5.75 5.75V18.25L18.25 12Z"/>
                        </svg>
                    </span>
                    <span class="pause-icon">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.25 6.75V17.25"/>
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.75 6.75V17.25"/>
                        </svg>
                    </span>
                </button>
                <button class="controls__fast-forward-btn">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 15.8603L4.75 18.25V5.75L8 8.13971"/>
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.25 12L10.75 5.75V18.25L19.25 12Z"/>
                    </svg>
                </button>
                <div class="time-container">
                    <span class="controls__current-time">0:00</span>
                    <span>/</span>
                    <span class="controls__total-time">00:00</span>
                </div>

                <div class="controls__volume-bar">
                    <div class="timeline">
                        <div class="thumb-indicator"></div>
                    </div>
                </div>
                <button class="controls__mini-player-btn">
                    <span class="mini-player-icon">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.25 17.25H6.75C5.64543 17.25 4.75 16.3546 4.75 15.25V6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V9.25"/>
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.75 13.75C10.75 13.1977 11.1977 12.75 11.75 12.75H18.25C18.8023 12.75 19.25 13.1977 19.25 13.75V18.25C19.25 18.8023 18.8023 19.25 18.25 19.25H11.75C11.1977 19.25 10.75 18.8023 10.75 18.25V13.75Z"/>
                        </svg>
                    </span>
                </button>
                <button class="controls__full-screen-btn">
                    <span class="fullscreen-icon">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.75 14.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H9.25"/>
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.25 14.75V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H14.75"/>
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.25 9.25V6.75C19.25 5.64543 18.3546 4.75 17.25 4.75H14.75"/>
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.75 9.25V6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H9.25"/>
                        </svg>
                    </span>
                    <span class="exit-fullscreen-icon">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.25 19.25V16.75C9.25 15.6454 8.35457 14.75 7.25 14.75H4.75"/>
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.75 19.25V16.75C14.75 15.6454 15.6454 14.75 16.75 14.75H19.25"/>
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.75 4.75V7.25C14.75 8.35457 15.6454 9.25 16.75 9.25H19.25"/>
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.25 4.75V7.25C9.25 8.35457 8.35457 9.25 7.25 9.25H4.75"/>
                        </svg>
                    </span>
                </button>
            </div>
         </div>

`


class videoPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.videoPlayer = this.shadowRoot.querySelector('.video-player')
        this.videoPlayer.appendChild(this.children[0])
        this.video = this.shadowRoot.querySelector("video")

        this.videoPlayer.style.width = this.getAttribute('width')
        this.videoPlayer.style.height = this.getAttribute('height')

        this.playPauseBtn = this.shadowRoot.querySelector('.controls__play-pause-btn');
        this.fullScreenBtn = this.shadowRoot.querySelector('.controls__full-screen-btn');
        this.miniPlayerBtn = this.shadowRoot.querySelector('.controls__mini-player-btn');
        this.videoCurrentTime = this.shadowRoot.querySelector('.controls__current-time')
        this.videoTotalTime = this.shadowRoot.querySelector('.controls__total-time')
        this.fastForwardBtn = this.shadowRoot.querySelector('.controls__fast-forward-btn')
        this.fastRewindBtn = this.shadowRoot.querySelector('.controls__fast-rewind-btn')
        this.timelineBar = this.shadowRoot.querySelector('.controls__timeline-bar')
        this.bufferBar = this.shadowRoot.querySelector('.controls__timeline-bar .buffer')
        this.volumeBar = this.shadowRoot.querySelector('.controls__volume-bar')
        this.isVolumeBarScrubbing = false
        this.isTimelineBarScrubbing = false
        this.volumeValue
        //Event listeners
        this.video.addEventListener('play', () => this.videoPlayer.classList.remove("paused"))
        this.video.addEventListener('pause', () => this.videoPlayer.classList.add("paused"))
        this.playPauseBtn.addEventListener('click', this.togglePlay)
        this.fullScreenBtn.addEventListener('click', this.toggleFullScreenMode)
        this.miniPlayerBtn.addEventListener('click', this.toggleMiniPlayerMode)
        this.fastForwardBtn.addEventListener('click', () => this.timeForward(10))
        this.fastRewindBtn.addEventListener('click', () => this.timeRewind(10))
        this.video.addEventListener('enterpictureinpicture', (e) => this.videoPlayer.classList.add("mini-player-mode"))
        this.video.addEventListener('leavepictureinpicture', (e) => this.videoPlayer.classList.remove("mini-player-mode"))
        window.document.addEventListener("fullscreenchange", (e) => {
            this.videoPlayer.classList.toggle("full-screen-mode", document.fullscreenElement)
        })

        this.video.addEventListener('loadeddata', () => {
            this.videoTotalTime.textContent = this.formatDuration(this.video.duration)
        })
        this.video.addEventListener('timeupdate', (e) => {
            this.videoCurrentTime.textContent = this.formatDuration(this.video.currentTime)
            //progress bar
            const percent = this.video.currentTime / this.video.duration
            this.timelineBar.style.setProperty('--progress-position', percent)
            //buffer bar
            let r = this.video.buffered
            let total = this.video.duration
            for (let i = 0; i < r.length; i++) {
                let start = r.start(i) / total * 100
                let end = r.end(i) / total * 100
                this.bufferBar.style.setProperty('--buffer-position', end + "%")
            }
        })

        window.document.addEventListener('keydown', e => {
            let tagName = window.document.activeElement.tagName.toLocaleLowerCase()
            if (tagName === "video-player") tagName = this.shadowRoot.activeElement.tagName.toLocaleLowerCase()
            if (tagName === "input") return //for expample if the the active element is the comment input
            switch (e.key.toLowerCase()) {
                case " ":
                    if (tagName === "button") return
                case "k":
                    this.togglePlay()
                    break
                case "f":
                    this.toggleFullScreenMode()
                    break
                case "i":
                    this.toggleMiniPlayerMode()
                    break
                case "m":
                    this.toggleMuteVolume()
                    break
                case "arrowleft":
                case "j":
                    this.timeRewind(10)
                    break
                case "arrowright":
                case "l":
                    this.timeForward(10)
                    break

            }
        })

        this.loadingZeroFormatter = new Intl.NumberFormat(undefined, {
            minimumIntegerDigits: 2
        })


        this.volumeBar.addEventListener('mousedown', this.handleMouseDownOnVolumeBar)
        window.document.addEventListener("mouseup", this.handleMouseUpOnVolumeBar)
        this.volumeBar.addEventListener('mousemove', this.hnadleMouseMoveOnVolumeBar)
        // eventlistener for handling volumebar scrubbing outside the the volume bar
        window.document.addEventListener("mousemove", e => {
            if (this.isVolumeBarScrubbing) this.hnadleMouseMoveOnVolumeBar(e)
        })


        this.timelineBar.addEventListener('mousedown', this.handleMouseDownOnTimelineBar)
        window.document.addEventListener('mouseup', this.hnadleMouseUpOnTimelineBar)
        this.timelineBar.addEventListener('mousemove', this.hnadleMouseMoveOnTimelineBar)
        // eventlistener for handling timeline scrubbing outside the the volume bar
        window.document.addEventListener("mousemove", e => {
            if (this.isTimelineBarScrubbing) this.hnadleMouseMoveOnTimelineBar(e)
        })


    }
    handleMouseDownOnTimelineBar = (mouseEvent) => {
        this.isTimelineBarScrubbing = (mouseEvent.buttons & 1) === 1
        this.hnadleMouseMoveOnTimelineBar(mouseEvent)
    }
    hnadleMouseUpOnTimelineBar = (e) => {
        if (this.isTimelineBarScrubbing) this.isTimelineBarScrubbing = false
    }
    hnadleMouseMoveOnTimelineBar = (e) => {
        const position = this.getRelativeXPosition(e , this.timelineBar)
        if (this.isTimelineBarScrubbing) {
            e.preventDefault()
            this.handleTimelineProgress(position)
        } else {
            this.handleTimelinePreviewPosition(position)
        }

    }
    handleTimelineProgress = (postionByPercent) => {
        this.timelineBar.style.setProperty('--progress-position', postionByPercent)
        this.video.currentTime = postionByPercent * this.video.duration
    }
    handleTimelinePreviewPosition = (postionByPercent) => {
        this.timelineBar.style.setProperty('--preview-position', postionByPercent)
    }





    handleMouseDownOnVolumeBar = (mouseEvent) => {
        this.isVolumeBarScrubbing = (mouseEvent.buttons & 1) === 1
        this.hnadleMouseMoveOnVolumeBar(mouseEvent)
    }
    handleMouseUpOnVolumeBar = e => {
        if (this.isVolumeBarScrubbing) this.isVolumeBarScrubbing = false
    }
    hnadleMouseMoveOnVolumeBar = (e) => {
        if (this.isVolumeBarScrubbing) {
            const value = this.getRelativeXPosition(e, this.volumeBar)
            this.setVolumeBarValue(value)
        }
    }
    setVolumeBarValue = (value) => {
        this.volumeBar.style.setProperty('--volume', value)
        this.setVolume(value)
    }
    setVolume = (volume) => {
        this.video.volume = volume
    }
    toggleMuteVolume = () =>  {
        if (!this.video.muted) {
            this.volumeValue = this.video.volume
            this.video.muted = true
            this.setVolumeBarValue(0)
        } else {
            this.video.muted = false
            this.setVolumeBarValue(this.volumeValue)
      
        }
    }

    togglePlay = () => this.video.paused ? this.video.play() : this.video.pause()

    timeForward = (duration) => { this.video.currentTime += duration }
    timeRewind = (duration) => { this.video.currentTime -= duration }

    formatDuration = (time) => {
        const seconds = Math.floor(time % 60)
        const minutes = Math.floor(time / 60) % 60
        const hours = Math.floor(time / 3600)
        if (hours === 0) {
            return `${minutes}:${this.loadingZeroFormatter.format(seconds)}`
        } else {
            return `${hours}:${this.loadingZeroFormatter.format(minutes)}:${this.loadingZeroFormatter.format(seconds)}`
        }
    }

    toggleMiniPlayerMode = () => {
        if (document.pictureInPictureElement == null) {
            this.video.requestPictureInPicture()
        } else {
            document.exitPictureInPicture()
        }
    }

    toggleFullScreenMode = () => {
        if (document.fullscreenElement == null) {
            this.videoPlayer.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    getRelativeXPosition = (mouseEvent, element) => {
        let rect = element.getBoundingClientRect()
        return Math.min(Math.max(0, mouseEvent.x - rect.x), rect.width) / rect.width
    }



    connectedCallback() {

    }

    disconnectedCallback() {
    }
}


window.customElements.define('schild-video-player', videoPlayer);




