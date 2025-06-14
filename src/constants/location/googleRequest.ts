import { addressTypes, AddressI, AddressType } from '../../interface/api/address';

const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!

export interface GLocationI {
    city: string
    region: string
    country: string
    zipcode: string
}

export interface GLocationParams {
    placeId: string,
    city: string,
    state: string,
    region: string,
    country: string,
    zipcode: string,
    formatted: string
}

export const gLocation = async ({
    city,
    region,
    country,
    zipcode
}: GLocationParams): Promise<google.maps.GeocoderResponse | null> => {
    const address = `${city + ','} ${region + ','} ${zipcode + ','} ${country}`;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json() as google.maps.GeocoderResponse;

        if (data.results.length) {
            const locationData = data.results[0];

            // Check the address components to ensure it matches
            const isValid = locationData && locationData.address_components.some((component: any) =>
                component.long_name === city ||
                component.short_name === region ||
                component.short_name === country
            )

            if (!isValid) return null

            return data
        } else {
            // If the status isn't OK, the location isn't valid
            return null
        }
    } catch (error) {
        console.error('Error fetching location data:', error);
        return null
    }
}

export const gAddress = async (address: string): Promise<google.maps.GeocoderResponse | null> => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleKey}`

    try {
        const response = await fetch(url);
        const data = await response.json() as google.maps.GeocoderResponse;

        if (data.results.length) {
            return data
        } else {
            return null
        }
    } catch (error) {
        console.error('Error fetching location data:', error);
        return null
    }
}
export const gPlaceId = async (placeId: string): Promise<google.maps.GeocoderResponse | null> => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${encodeURIComponent(placeId)}&key=${googleKey}`

    try {
        const response = await fetch(url);
        const data = await response.json() as google.maps.GeocoderResponse;

        if (data.results.length) {
            return data
        } else {
            return null
        }
    } catch (error) {
        console.error('Error fetching location data:', error);
        return null
    }
}

// export const getDistance = async (originPlaceId: string, destinationPlaceId: string): Promise<number | null> => {
//     const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${originPlaceId}&destinations=place_id:${destinationPlaceId}&key=${googleKey}`

//     try {
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         console.log("response: ", response)
//         const data = await response.json() as google.maps.DistanceMatrixResponse;
//         console.log("Distance Data: ", data)

//         if (data.rows.length && data.rows[0].elements.length) {
//             const distance = data.rows[0].elements[0].distance.value; // distance in meters
//             return distance;
//         } else {
//             return null
//         }
//     } catch (error) {
//         console.error('Error fetching distance data:', error);
//         return null
//     }
// }

export const metersToMiles = (meters: number): number => {
    const exact = meters * 0.000621371; // Convert meters to miles
    return Math.round(exact * 100) / 100; // Round to two decimal places
}
export const metersToKm = (meters: number): number => {
    return meters / 1000; // Convert meters to kilometers
}

export interface GeocodeResultI {
    placeId: string
    address: string
    city: string;
    region: string;
    country: string;
    zipcode: string
    geolocation: {
        lat: number;
        lng: number;
    };
    latitude: number
    longitude: number
    bounds: {
        northeast: { lat: number; lng: number };
        southwest: { lat: number; lng: number };
    }
    index?: string
    type?: AddressType
}

export const parseGeocodeResult = (result: any): GeocodeResultI | null => {
    if (!result && !result?.address_components.length) {
        return null
    }

    let placeId = result.place_id as string
    let city = ""
    let region = ""
    let country = ""
    let zipcode = ""
    let route = ""
    let streetNumber = ""
    let type: AddressType = "Default"

    result.address_components.forEach((component: any) => {
        if (component.types.includes("locality")) {
            city = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
            region = component.short_name;
        }
        if (component.types.includes("country")) {
            country = component.short_name;
        }
        if (component.types.includes("postal_code")) {
            zipcode = component.short_name;
        }
        if (component.types.includes("route")) {
            route = component.long_name
        }
        if (component.types.includes("street_number")) {
            streetNumber = component.long_name
        }
    })

    const geolocation = {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
    };

    const areaTypes = ["locality", "political"]
    if (result?.types.filter((a: string) => areaTypes.includes(a))) {
        type = "Area"
    }

    if (result?.types.includes("premise") || result?.types.includes("subpremise")) {
        type = "Default"
    }

    const latitude = result.geometry.location.lat
    const longitude = result.geometry.location.lng

    const bounds = result.geometry.bounds
        ? {
            northeast: {
                lat: result.geometry.bounds.northeast.lat,
                lng: result.geometry.bounds.northeast.lng,
            },
            southwest: {
                lat: result.geometry.bounds.southwest.lat,
                lng: result.geometry.bounds.southwest.lng,
            },
        }
        : {
            northeast: { lat: geolocation.lat, lng: geolocation.lng },
            southwest: { lat: geolocation.lat, lng: geolocation.lng },
        };

    return {
        placeId,
        city,
        region,
        country,
        geolocation,
        latitude,
        longitude,
        bounds,
        zipcode,
        address: result.formatted_address || `${streetNumber} ${route}, ${city}, ${region}, ${country}`,
        type
    };
};