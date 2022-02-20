const app = document.getElementById('root');



// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest()

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://ghibliapi.herokuapp.com/films')

request.onload = function () {
  // Begin accessing JSON data here

    var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
        data.forEach(movie => {
            console.log(movie.title)
            const h2 = document.createElement('h2');
            h2.textContent = movie.title
            app.appendChild(h2);
        })
    } else {
        console.log('error')
    }
}

// Send request
request.send()