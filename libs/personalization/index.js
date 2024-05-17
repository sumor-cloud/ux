class Personalization {
  constructor() {
    if (typeof window !== 'undefined' && window) {
      const personalization = window.localStorage.getItem('personalization') || '{}'
      this.personalization = JSON.parse(personalization)

      const personalizationOptions = ['dark', 'language', 'timezone']
      personalizationOptions.forEach(key => {
        if (this.personalization[key] === undefined) {
          this.personalization[key] = null
        }
      })
    }
  }

  get dark() {
    if (this.personalization.dark !== null) {
      return this.personalization.dark
    } else {
      if (typeof window !== 'undefined' && window) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      }
    }
  }

  get language() {
    if (this.personalization.language !== null) {
      return this.personalization.language
    } else {
      return navigator.language
    }
  }

  get timezone() {
    if (this.personalization.timezone !== null) {
      return this.personalization.timezone
    } else {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }
}
const personalization = new Personalization()
export default personalization
