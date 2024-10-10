import { late } from "zod"
import { fStateByLong } from "./location/us/states"

export interface IPDataI {
    ip: string
    /**ex. Charlotte */
    city: string
    /**ex. North Carolina*/
    region: string
    /** ex. US */
    country: string
    //**"[lattitude], [longitude]" */
    loc: string
    postal: string
    //**IANA */
    timezone: string
    latitude: number
    longitude: number
}
export const getIPData = async (ip: string): Promise<IPDataI | null> => {
    try {
        const key = process.env.NEXT_PUBLIC_IP_API
        if (!key) {
            return null
        }

        const res = await fetch(`https://ipinfo.io/${ip}?token=${key}`)
        if (!res.ok) {
            return null
        }

        const data = await res.json() as IPDataI

        [data.latitude, data.longitude] = data.loc.split(',').map(Number)
        if (data.country === "US") {
            data.region = fStateByLong(data.region) || data.region
        }

        return data
    } catch (e) {
        console.error("ip error: ", e)
        return null
    }
}