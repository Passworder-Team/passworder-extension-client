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

function showTextInfo(text) {
  $('#text-info').empty()
  $('#text-info').append(text)
  $('#text-info').show()
}

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
    // welcome section ditampilkan
    $('#section-register').hide()
    $('#section-welcome').show()
    $('#section-login').hide()

    if (response.token) {
      console.log('tokennya ada', response.token)
      // cek apakah ada tokennnnn
      $('#button-login').hide()
      $('#button-register').hide()
      $('#button-logout').show()
      token = response.token
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: 'hello' }, function(
          response
        ) {
          credentials = response.credentials

          if (credentials.email && credentials.password) {
            $('#div-add-credentials').show()
            $('#text-info').hide()
            $('#email').val(credentials.email)
            $('#password').val(credentials.password)
          } else {
            console.log('kenak trigger, gaada credentials')
            $('#div-add-credentials').hide()
            showTextInfo('No credentials detected.')
          }
        })
      })
    } else {
      console.log('ini kenak trigger')
      showTextInfo('')
      $('#div-add-credentials').hide()
      $('#button-login').show()
      $('#button-register').show()
      $('#button-logout').hide()
    }
  })
}

function register() {
  const phoneNumber = $('#register-phone').val()
  const name = $('#register-name').val()
  const email = $('#register-email').val()
  const password = $('#register-password').val()

  const data = { email, password, name, phoneNumber }
  console.log(data)
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
      // tampilkan password saved
      showTextInfo('Credentials saved.')
    })
    .fail(err => {
      console.log(err)
    })
}

function logout() {
  chrome.storage.local.clear()
  showWelcomePage()
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
  $('#button-logout').click(function() {
    logout()
  })
  
})
