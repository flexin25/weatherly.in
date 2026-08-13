export default async function handler(req, res) {
    // Allow requests only from your own domain
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { endpoint, ...params } = req.query;

    const validEndpoints = ['weather', 'forecast', 'air_pollution'];
    if (!endpoint || !validEndpoints.includes(endpoint)) {
        return res.status(400).json({ error: 'Invalid endpoint' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    const queryString = new URLSearchParams({ ...params, appid: apiKey }).toString();
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?${queryString}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch weather data' });
    }
}
