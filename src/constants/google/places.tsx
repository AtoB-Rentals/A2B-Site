// "use server"
import { Client, PlaceAutocompleteResult, PlaceAutocompleteType } from "@googlemaps/google-maps-services-js"

export const client = new Client()

export const autoComplete = async (input: string, type?: string): Promise<PlaceAutocompleteResult[]> => {
    try {
        if (!input) return []
        const addType = type ? `&type=${type}` : ""
        const response = await fetch(`/api/autoComplete?input=${encodeURIComponent(input)}${addType}`)

        const data = await response.json()

        return data.predictions || []
    } catch (e) {
        console.error(e)
        return []
    }
}