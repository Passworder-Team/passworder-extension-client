// on boot or on load
// chrome.storage.local.get('colour', response => {
//   if (response.colour) {
//     document.body.style.backgroundColor = response.colour
//   }
// })

// document.addEventListener('click', () => alert('Click occurred!'))
// chrome.runtime.onMessage.addListener(request => {
//   if (request.colour) {
//     document.body.style.backgroundColor = request.colour
//   }
// })

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  )
  if (request.greeting == 'hello') {
    const email = $(':text').val()
    const password = $(':password').val()
    const credentials = {
      email,
      password,
      account: window.location.href
    }
    sendResponse({ credentials })
  }
})

$(document).ready(function() {
  // check if there is available credentials
  console.log(window.location.href)
  chrome.storage.local.get('token', response => {
    if (response.token) {
      const token = response.token
      console.log('token getted', response.token)
      $.ajax({
        type: 'GET',
        url: `http://localhost:3000/passwords`,
        headers: {
          token
        }
      })
        .done(result => {
          result.forEach(el => {
            console.log(el.account === window.location.href)
            if (el.account === window.location.href) {
              $('input:text').val(el.email)
              $('input:password').val(el.password)
            }
          })
        })
        .fail(err => {
          console.log(err)
        })
    }
  })

  $('form').submit(function(event) {
    event.preventDefault()
    console.log('Triggered')
  })
  console.log('Triggered')
  // add event listener here then send message to popup.js or background.js
})
