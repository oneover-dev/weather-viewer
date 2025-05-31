async function checkWeather(city) {
    try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=3`);
        const data = await response.text();
        console.log(data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkWeather("your_city") 
