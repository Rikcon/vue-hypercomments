'use strict'
Vue.use(VueYouTubeEmbed)

window.app = new Vue({
  el: '#app',
  data: {
    videoId: 'M7lc1UVf-VE',
    nextId: '',
    videos: [],
    width: '640',
    height: '390'
  },
  methods: {
    pause() {
      this.player.pauseVideo()
    },
    next() {
      this.videoId = this.nextId
      this.nextId = ''
    },
    add() {
      this.videos.push({videoId: this.nextId})
      this.nextId = ''
    },
    remove() {
      this.videos.pop()
    }
  },
  components: {
    VideoList: {
      props: ['video'],
      data: function() {
        return {
          log: []
        }
      },
      filters: {
        url: VueYouTubeEmbed.getIdFromURL
      },
      template: `
        <div>
          <h2>video: {{video}}</h2>
          <youtube :video-id="video | url"
            @ready="ready"
            @ended="ended"
            @playing="playing"
            @paused="paused"
            @buffering="buffering"
            @queued="queued">
          </youtube>
          <ol><li v-for="item in log">type: {{item.type}}</li></ol>
        </div>`
        ,
      methods: (function() {
        var events = ['ready', 'ended', 'playing', 'paused', 'buffering', 'queued']
        var methods = {}

        events.forEach(function(event) {
          methods[event] = function(player) {
            console.log({type: event, player: player})
            this.log.push({type: event})
          }
        })

        return methods
      })()
    }
  }
})
