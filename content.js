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

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.greeting == "hello") {
      const email = $(":text").val()
      const password = $(":password").val()
      const credentials = {
        email,
        password,
        account: window.location.href
      }
      sendResponse({ credentials });
    }
  });

$(document).ready(function () {
  $("form").submit(function (event) {
    event.preventDefault()
    console.log('Triggered')
  })
  // add event listener here then send message to popup.js or background.js
})