const clock = document.getElementById('clock');
const quote = document.getElementById('quote');
const author = document.getElementById('author');

const randomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

const setClock = () => {
  let time = new Date();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  clock.innerText = document.title = hours + ":" + minutes + ":" + seconds
}

const setQuote = () => {
  let q = randomQuote();
  quote.innerText = q.quote;
  author.innerText = q.author;
}

setQuote();
setClock();
setInterval(setClock, 1000);
