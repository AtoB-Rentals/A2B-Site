"use client"

import { autoComplete } from "@/constants/google/places";
import { GeocodeResultI, gPlaceId, parseGeocodeResult } from "@/constants/location/googleRequest";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface UsePlaceautoCompleteI {

}

interface UsePlaceautoCompleteResI {
    input: string,
    setInput: Dispatch<SetStateAction<string>>,
    handleGoogleSel: (prediction: PlaceAutocompleteResult) => void,
    selAddress: GeocodeResultI | undefined,
    setSelAddress: Dispatch<SetStateAction<GeocodeResultI | undefined>>
    predictions: PlaceAutocompleteResult[]
    setPredictions: Dispatch<SetStateAction<PlaceAutocompleteResult[]>>
}

const usePlaceautoComplete = ({

}: UsePlaceautoCompleteI): {
    input: string,
    setInput: Dispatch<SetStateAction<string>>,
    handleGoogleSel: (prediction: PlaceAutocompleteResult) => void,
    selAddress: GeocodeResultI | undefined,
    predictions: PlaceAutocompleteResult[],
    setSelAddress: Dispatch<SetStateAction<GeocodeResultI | undefined>>
    setPredictions: Dispatch<SetStateAction<PlaceAutocompleteResult[]>>
} => {
    const [input, setInput] = useState<string>("")
    const [trigger, setTrigger] = useState<boolean>(false)
    const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([])
    const [
        /**the selected address from google autocomplete */
        selAddress,
        setSelAddress
    ] = useState<GeocodeResultI | undefined>()

    useEffect(() => {
        // Create a timeout that updates the debouncedStreet after 300ms (or any other delay you prefer)
        const handler = setTimeout(() => {
            setTrigger(!trigger)
        }, 300);

        // Clear the timeout if the user is still typing (before 300ms passes)
        return () => {
            clearTimeout(handler);
        };
    }, [input])

    useEffect(() => {
        (async () => {
            if (input.length > 2) {
                const opts = await autoComplete(input, /*searchTypeMap[currentSearchType] */);

                setPredictions([...opts]);
            }
        })();
    }, [trigger])

    const handleGoogleSel = async (prediction: PlaceAutocompleteResult) => {
        /**@ts-ignore */
        if (prediction.types.includes("establishment")) {
            await setInput(prediction.structured_formatting.main_text + " - " + prediction.structured_formatting.secondary_text)
        }

        const googleAddresses = await gPlaceId(prediction.place_id)
        if (googleAddresses === null) {
            alert("something went wrong")
            return
        }

        const geoCodeAddress = parseGeocodeResult(googleAddresses.results[0])
        if (geoCodeAddress === null) {
            alert("something went wrong")
            return
        }

        //@ts-ignore
        if (!prediction.types.includes("establishment")) {
            setInput(geoCodeAddress.address)
        }

        const areaTypes = ["locality", "political"]

        //@ts-ignore
        if (prediction.types.filter(p => areaTypes.includes(p))) {
            geoCodeAddress.type = "Area"
        }

        //@ts-ignore
        if (prediction.types.includes("premise")) {
            geoCodeAddress.type = "Default"
        }

        /**@ts-ignore */
        if (prediction.types.includes("airport")) {
            geoCodeAddress.type = "Airport"
        }

        // setInput(geoCodeAddress.address)
        setSelAddress(geoCodeAddress)
        setPredictions([])
    }

    return ({
        input,
        setInput,
        handleGoogleSel,
        selAddress,
        predictions,
        setSelAddress,
        setPredictions,
    })
}

export default usePlaceautoComplete