const $siteList = $('.siteList')
const $lastLi = $('.lastLi')
const navString = localStorage.getItem('navigation') || null
let hashMap = JSON.parse(navString) || []

const simplifyUrl = (url) => {
  return url.replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace(/\/.*/, '')
}

const render = () => {
  $siteList.find($('li:not(.lastLi)')).remove()
  hashMap.forEach((value, key) => {
    const $li = $(`<li>
      <div class="site">
          <div class="logo">${value.logo[0]}</div>
          <div class="link">${simplifyUrl(value.url)}</div>
          <div class="close">
            <svg class="icon">
              <use xlink:href="#icon-close"></use>
            </svg>
          </div>
        </div>
    </li>`).insertBefore($lastLi)
    $li.on('click', () => {
      window.open(value.url)
    })
    $li.on('click', '.close', (e) => {
      hashMap.splice(key, 1)
      e.stopPropagation()
      render()
    })
  })
}
render()

$('.addButton').on('click', () => {
  let url = window.prompt('请添加网址名')
  if (url.indexOf('http') !== 0) {
    url = 'https://' + url
  }

  hashMap.push({
    url: url,
    logo: simplifyUrl(url)[0]
  })
  render()
})

if (!window.onbeforeunload) {
  window.onpagehide = () => {
    localStorage.setItem('navigation', JSON.stringify(hashMap))
  }
} else {
  window.onbeforeunload = () => {
    localStorage.setItem('navigation', JSON.stringify(hashMap))
  }
}

$(document).on('keypress', (e) => {
  const {key} = e
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url)
    }
  }
})
