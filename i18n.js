// SECTIONS MODIFIED FROM LV ARE COMMENTED (yymmdd.hhmm)

// LANGUAGE SETTINGS
function getCookie (name) {
  const value = '; ' + document.cookie
  const parts = value.split('; ' + name + '=')
  if (parts.length === 2) return parts.pop().split(';').shift()
}
function setCookie (cname, cvalue, exhours) {
  const d = new Date()
  d.setTime(Date.now() + (exhours * 60 * 60 * 1000))
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}
function setBodyClassUserLang (userLang) {
  document.getElementsByTagName('body')[0].classList.add(`__i18n-${userLang}`)
}

const langElements = document.querySelectorAll('[data-i18n]')
const userLang = getCookie('lang') || navigator.language || navigator.userLanguage
setBodyClassUserLang(userLang)

const langPicker = document.getElementById('langPicker')

//MODIFIED FROM LV (210820.1412)
var REPLACEMENTS = {
  colors: {
    con: '#890000', //conservative
    lf: '#88232B', //liberal f
    rf: '#560000', //radical f
    sf: '#782F52', //socialist f
    cu: '#963B33', //cultural
    wc: '#804E00' //women of color
  }
}

const replace = (string, values = null) => {
  if (values) {
    Object.getOwnPropertyNames(values).forEach((val, idx, array) => {
      REPLACEMENTS[val] = values[val]
    })
  }
  const re = /{{([\w\.]+)}}/

  let m
  do {
    m = re.exec(string)
    if (m) {
      const x = m[1].split('.')
      switch (x.length) {
        case 1:
          string = string.replace(m[0], REPLACEMENTS[x[0]])
          break
        case 2:
          string = string.replace(m[0], REPLACEMENTS[x[0]][x[1]])
          break
        case 3:
          string = string.replace(m[0], REPLACEMENTS[x[0]][x[1]][x[2]])
          break
        default:
          console.error('nested replacements only allowed up to 3 levels')
          break
      }
    }
  } while (m)

  return string
}

const i18n = {
  getString (name, parameters = null) {
    if (userLang in i18n.l10n && name in i18n.l10n[userLang]) {
      if (parameters) {
        return replace(i18n.l10n[userLang][name], parameters)
      }
      return replace(i18n.l10n[userLang][name])
    }
    console.log(`using fallback for ${name}`)
    if (parameters) {
      return replace(i18n.l10n.en[name], parameters)
    }
    return replace(i18n.l10n.en[name])
  },
  lang: userLang,
  l10n: {}
}

const addLanguage = (code, properties) => {
  i18n.l10n[code] = properties
  // Language picker
  if (langPicker) {
    const option = document.createElement('option')
    option.text = i18n.l10n[code].language_name
    option.value = code

    if (option in langPicker.options) {
    } else {
      langPicker.add(option)
    }
    if (option.value === userLang) {
      langPicker.value = userLang
    }
  }
}

const getl10n = async (code) => {
  const url = `/lang/lang_${code}.json`
  await window.fetch(url)
    .then(res => res.json())
    .then(out => addLanguage(code, out))
    .catch(err => { throw err })
}

// MODIFIED FROM LV (210820.1413)
async function loadTranslation () { // eslint-disable-line no-unused-vars
  return Promise.all([
    getl10n('en'),
    getl10n('ja')
  ]).then(() => {
    console.log(i18n)

    langElements.forEach((element) => {
      const value = element.getAttribute('data-i18n')
      element.innerHTML = i18n.getString(value)
    })
    if (langPicker) {
      langPicker.onchange = function () {
        const language = langPicker.options[langPicker.selectedIndex].value
        setCookie('lang', language, 5)
        window.location.reload()
      }
    }
  })
}

function delayPromise (duration) { // eslint-disable-line no-unused-vars
  return function (...args) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(...args)
      }, duration)
    })
  }
}
