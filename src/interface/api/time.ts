
export interface TimeI {
    /**UTC in ISO */
    utc: string
    /**Local time in ISO */
    local: string
    /**ex. America/New_York */
    iana: string
    /**UTC of JS understandable time */
    goTime: Date
}

export interface PostTimeI {
    local: string
    iana: string
}