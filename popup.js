// document.querySelector('#colour-submit-btn').addEventListener('click', () => {
//   // read the colour that the user has selected
//   const colour = document.querySelector('#colour-input').value
//   // save to storage
//   chrome.storage.local.set({ colour })
//   // get all the google tabs and send a message to their tabs
//   chrome.tabs.query({ url: 'https://*.google.com/*' }, tabs => {
//     tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, { colour }))
//   })
// })

// GLOBAL VARS

let credentials
let token

function showRegisterPage() {
  $('#section-register').show()
  $('#section-welcome').hide()
  $('#section-login').hide()
}
function showLoginPage() {
  $('#section-register').hide()
  $('#section-welcome').hide()
  $('#section-login').show()
}
function showWelcomePage() {
  chrome.storage.local.get('token', response => {
    $('#section-register').hide()
    $('#section-welcome').show()
    $('#section-login').hide()
    if (response.token) {
      token = response.token
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: 'hello' }, function(
          response
        ) {
          credentials = response.credentials
          $('#button-login').hide()
          $('#button-register').hide()

          if (credentials.email && credentials.password) {
            $('#div-add-credentials').show()
            $('#email').val(credentials.email)
            $('#password').val(credentials.password)
          } else {
            $('#div-add-credentials').hide()
            $('#text-info').val('No credentials detected.')
          }
        })
      })
    } else {
      $('#button-login').show()
      $('#button-register').show()
      // show button login and register
    }
  })
}

function register() {
  const name = $('#register-name').val()
  const email = $('#register-email').val()
  const password = $('#register-password').val()

  const data = { email, password, name }
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/auth/register',
    data
  })
    .done(result => {
      console.log(result)
      chrome.storage.local.set({ token: result.token })
      chrome.storage.local.set({ name: result.name })
      chrome.storage.local.set({ email: result.email })
      showWelcomePage()
    })
    .fail(err => {
      console.log(err)
    })
}

function addCredentials() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/passwords',
    data: credentials,
    headers: {
      token
    }
  })
    .done(result => {
      console.log(result)
      // hide form
      $('#div-add-credentials').hide()
    })
    .fail(err => {
      console.log(err)
    })
}

function login() {
  const email = $('#login-email').val()
  const password = $('#login-password').val()

  const data = { email, password }
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/auth/login',
    data
  })
    .done(result => {
      console.log(result)
      chrome.storage.local.set({ token: result.token })
      chrome.storage.local.set({ name: result.name })
      chrome.storage.local.set({ email: result.email })
      showWelcomePage()
    })
    .fail(err => {
      console.log(err)
    })
}

$(document).ready(function() {
  showWelcomePage()

  $('#form-register').submit(function(e) {
    e.preventDefault()
    register()
  })
  $('#form-login').submit(function(e) {
    e.preventDefault()
    login()
  })
  $('#button-register').click(function() {
    showRegisterPage()
  })
  $('#button-login').click(function() {
    showLoginPage()
  })
  $('#form-add-credentials').submit(function(e) {
    e.preventDefault()
    addCredentials()
  })
})
