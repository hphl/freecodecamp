(function () {

  function HttpRequester() {
    if (window.XMLHttpRequest)
      this.xmlhttp = new XMLHttpRequest();
    else
      this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    this.xmlhttp.overrideMimeType("application/json");
  }

  HttpRequester.prototype.request = function httpRequesterRequest(callback, url, header) {
    this.xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        callback(this.responseText);
      }
    };
    this.xmlhttp.open("GET", url, true);
    this.setHeader(header);
    this.xmlhttp.send();
  }

  HttpRequester.prototype.setHeader = function (header) {
    if (!header) return;

    for (const key in header) {
      this.xmlhttp.setRequestHeader(key, header[key]);
    }

  };

  function ColorChanger() { }

  ColorChanger.prototype.changeColor = function () {
    var colors = ['#16A085', '#27AE60', '#2C3E50', '#F39C12', '#E74C3C',
      '#9B59B6', '#FB6964', '#342224', '#472E32', '#BDBB99', '#77B1A9', '#73A857'];
    var color_index = Math.floor(Math.random() * colors.length);

    document.querySelector('body').style.color = colors[color_index];
    document.querySelector('body').style.backgroundColor = colors[color_index];
    document.querySelector('#tweet-quote').style.backgroundColor = colors[color_index];
    document.querySelector('#new-quote').style.backgroundColor = colors[color_index];
  }

  function QuoteDisplayer() {
    this.colorChanger = new ColorChanger();
  }

  QuoteDisplayer.prototype.displayQuote = function (quote) {
    this.colorChanger.changeColor();
    var quoteObject = JSON.parse(quote)[0];
    var quote_text = quoteObject.quote;
    var author = quoteObject.author;

    document.querySelector('#text span').textContent = quote_text;
    document.querySelector('#author').textContent = '- ' + author;
    document.querySelector('#tweet-quote').href = 'https://twitter.com/intent/tweet?text="' + quote_text + '" -' + author;
  }

  function QuoteManager(url, header) {
    this.httpRequester = new HttpRequester();
    this.quoteDisplayer = new QuoteDisplayer();
    this.url = url;
    if (header)
      this.header = header;
  }

  QuoteManager.prototype.display = function () {
    this.httpRequester.request(this.quoteDisplayer.displayQuote.bind(this.quoteDisplayer), this.url, this.header);
  }

  var quoteManager = new QuoteManager('https://andruxnet-random-famous-quotes.p.mashape.com',
    {
      'X-Mashape-Key': 'qYBcEJRuZdmshCMKrSkYS0hkCBI4p1ewuqyjsnz9sGqKM64Pmg',
      'Accept': 'application/json'
    }
  );

  quoteManager.display();

  document.querySelector('#new-quote').addEventListener('click', quoteManager.display.bind(quoteManager));

})();