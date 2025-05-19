const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const city = decodeURIComponent(parsedUrl.pathname.slice(1));

  if (!city) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Please provide a city in the URL, e.g. /newyork' }));
    return;
  }

  const apiUrl = `https://wttr.in/${city}?format=j1`;

  https.get(apiUrl, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      try {
        const weather = JSON.parse(data);
        const currentCondition = weather.current_condition[0];

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          city: city,
          temperature: currentCondition.temp_C + '°C',
          description: currentCondition.weatherDesc[0].value,
          humidity: currentCondition.humidity + '%',
          wind: currentCondition.windspeedKmph + ' km/h'
        }, null, 2));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to parse weather data' }));
      }
    });

  }).on('error', (err) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to fetch weather data' }));
  });
});

server.listen(PORT, () => {
  console.log(`Weather Checker server running at http://localhost:${PORT}`);
});
