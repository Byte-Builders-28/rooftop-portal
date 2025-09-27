export async function handler(event) {
	const { lat, lng, city, state } = event.queryStringParameters || {};
	const apiKey = process.env.OPENCAGE_KEY;

	let url;
	if (lat && lng) {
		url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&no_annotations=1&language=en`;
	} else if (city) {
		url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
			city + (state ? ", " + state : "")
		)}&key=${apiKey}&no_annotations=1&language=en`;
	} else {
		return { statusCode: 400, body: "Missing parameters" };
	}

	try {
		const response = await fetch(url);
		const data = await response.json();
		return { statusCode: 200, body: JSON.stringify(data) };
	} catch (err) {
		return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
	}
}
