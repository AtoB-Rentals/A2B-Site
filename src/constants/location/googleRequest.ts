
const googleKey = process.env.YOUR_GOOGLE_API_KEY!

export interface GLocationI {
    city: string
    region: string
    country: string
    zipcode: string
}

const gLocation = async ({
    city,
    region,
    country,
    zipcode
}: GLocationI) => {
    const address = `${city + ','} ${region + ','} ${zipcode + ','} ${country}`;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
            const locationData = data.results[0];

            // Check the address components to ensure it matches
            const isValid = locationData && locationData.address_components.some((component: any) =>
                component.long_name === city ||
                component.short_name === region ||
                component.short_name === country
            );

            return {
                valid: isValid,
                location: isValid ? locationData : null
            };
        } else {
            // If the status isn't OK, the location isn't valid
            return {
                valid: false,
                message: data.status // Possible values: ZERO_RESULTS, INVALID_REQUEST, etc.
            };
        }
    } catch (error) {
        console.error('Error fetching location data:', error);
        return {
            valid: false,
            message: 'API request failed'
        };
    }
}