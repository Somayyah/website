const fs = require('fs');
const cowsay = require('cowsay');

// Read quotes from a local JSON file
fs.readFile('static/quotes.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading quotes file:', err);
    return;
  }

  const quotes = JSON.parse(data).quotes;
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const cowText = cowsay.say({
    text: `"${randomQuote.quote}" - ${randomQuote.author}`,
    e: 'oo', // Eyes
    T: 'U ', // Tongue
    wrap: 50, // Wrap text to 50 characters
  });

  // Write the cow text to a JSON file that Hugo can read
  const result = {
    cowText: cowText,
  };

  fs.writeFile('static/random-quote.json', JSON.stringify(result), (writeErr) => {
    if (writeErr) {
      console.error('Error writing quote file:', writeErr);
    } else {
      console.log('Random quote and cow text generated successfully!');
    }
  });
});
