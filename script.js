import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

new Vue({
  el: '#app',
  computed: {
    microImg() {
      return this.microActivated ? 'micro-active.svg' : 'micro.svg'
    }
  },
  data() {
    return {
      microActivated: false,
      microSpeechRecognitionObj: null,
      microSpeechGrammarListObj: null,

      optionsVisible: false,
      options: [
        {
          icon: 'img/play.svg',
          iconActive: 'img/pause.svg',
          isTogglable: true,
          active: false,
          name: 'lecture'
        },
        {
          icon: 'img/masque.svg',
          iconActive: 'img/masque-active.svg',
          isTogglable: true,
          active: true,
          name: 'mode masque'
        },
        {
          icon: 'img/dialog.svg',
          iconActive: 'img/dialog-active.svg',
          isTogglable: true,
          active: false,
          name: 'lire définition'
        },
        {
          icon: 'img/a-minus.svg',
          isTogglable: false,
          name: 'rétrécir texte'
        },
        {
          icon: 'img/a-plus.svg',
          isTogglable: false,
          name: 'agrandir texte'
        },
        {
          icon: 'img/cressant.svg',
          iconActive: 'img/cressant-active.svg',
          isTogglable: true,
          active: false,
          name: 'mode nuit'
        },
        {
          icon: 'img/motus.svg',
          iconActive: 'img/motus-active.svg',
          isTogglable: true,
          active: false,
          name: 'motus'
        },
        {
          icon: 'img/cressant.svg',
          iconActive: 'img/cressant-active.svg',
          isTogglable: false,
          name: 'fonctionnalité nom implémentée'
        },
        {
          icon: 'img/cressant.svg',
          iconActive: 'img/cressant-active.svg',
          isTogglable: false,
          name: 'fonctionnalité nom implémentée'
        },
        {
          icon: 'img/cressant.svg',
          iconActive: 'img/cressant-active.svg',
          isTogglable: false,
          name: 'fonctionnalité nom implémentée'
        },
        {
          icon: 'img/cressant.svg',
          iconActive: 'img/cressant-active.svg',
          isTogglable: false,
          name: 'fonctionnalité nom implémentée'
        },
        {
          icon: 'img/cressant.svg',
          iconActive: 'img/cressant-active.svg',
          isTogglable: false,
          name: 'fonctionnalité nom implémentée'
        },
        {
          icon: 'img/cressant.svg',
          iconActive: 'img/cressant-active.svg',
          isTogglable: false,
          name: 'fonctionnalité nom implémentée'
        }
      ]
    }
  },
  methods: {
    speak(lang = 'en-US', text) {
      let voice = new SpeechSynthesisUtterance(text)
      voice.lang = lang
      window.speechSynthesis.speak(voice)
      console.log('Speak:', text)
    },
    clickOption(option) {
      let textToSay = option.name
      if (option.isTogglable) {
        textToSay = `${option.active ? 'Désactiver' : 'Activer'} ${textToSay}`
        option.active = !option.active
      }
      this.speak('fr-FR', textToSay)
      // Execute function of option
    },

    toggleMicro() {
      this.microActivated = !this.microActivated
      if (this.microActivated && !this.microSpeechRecognitionObj) this.hearInit('fr-FR')

      if (this.microActivated) this.hearStart()
      else this.hearStop()
    },
    hearInit(lang = 'en-US') {
      const grammar = `#JSGF V1.0; grammar commands; public <command> = ${this.options.map(x => x.name).join(' | ')};`
      this.microSpeechRecognitionObj = new SpeechRecognition()
      this.microSpeechGrammarListObj = new SpeechGrammarList()
      this.microSpeechGrammarListObj.addFromString(grammar, 1)

      this.microSpeechRecognitionObj.grammars = this.microSpeechGrammarListObj
      this.microSpeechRecognitionObj.continuous = true
      this.microSpeechRecognitionObj.lang = lang
      this.microSpeechRecognitionObj.interimResults = false
      this.microSpeechRecognitionObj.maxAlternatives = 1
      this.microSpeechRecognitionObj.onresult = e => {
        /** @type {string} */
        let recognizedSpeech = e.results[e.results.length - 1][0].transcript.toLowerCase().trim()
        console.log('Heard:', recognizedSpeech)

        const recognize = (keywords, newActiveState = true) => {
          if (keywords) recognizedSpeech = recognizedSpeech.replace(new RegExp(keywords.join('|'), 'g'), '').trim()

          let askedOption = this.options.filter(x => x.name).find(x => recognizedSpeech.includes(x.name))
          if (askedOption) {
            let textToSay = askedOption.name
            if (askedOption.isTogglable) {
              textToSay = `${newActiveState ? 'Activer' : 'Désactiver'} ${textToSay}`
              askedOption.active = newActiveState
            }
            this.speak('fr-FR', textToSay)
            // Execute function of option
          }
        }
        const offKeywords = ['désactiver', 'désactivation', 'désactive']
        const onKeywords = ['activer', 'activation', 'active']
        const rfn = x => recognizedSpeech.includes(x)
        if (offKeywords.some(rfn)) recognize(offKeywords, false)
        else if (onKeywords.some(rfn)) recognize(onKeywords, true)
        else recognize()
      }
    },
    hearStart() {
      this.microSpeechRecognitionObj.start()
    },
    hearStop() {
      this.microSpeechRecognitionObj.stop()
    }
  }
})
