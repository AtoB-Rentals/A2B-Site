interface State {
    short: string;
    long: string;
}

export const states: { [key: string]: State } = {
    AL: { short: "AL", long: "Alabama" },
    AK: { short: "AK", long: "Alaska" },
    AZ: { short: "AZ", long: "Arizona" },
    AR: { short: "AR", long: "Arkansas" },
    CA: { short: "CA", long: "California" },
    CO: { short: "CO", long: "Colorado" },
    CT: { short: "CT", long: "Connecticut" },
    DE: { short: "DE", long: "Delaware" },
    FL: { short: "FL", long: "Florida" },
    GA: { short: "GA", long: "Georgia" },
    HI: { short: "HI", long: "Hawaii" },
    ID: { short: "ID", long: "Idaho" },
    IL: { short: "IL", long: "Illinois" },
    IN: { short: "IN", long: "Indiana" },
    IA: { short: "IA", long: "Iowa" },
    KS: { short: "KS", long: "Kansas" },
    KY: { short: "KY", long: "Kentucky" },
    LA: { short: "LA", long: "Louisiana" },
    ME: { short: "ME", long: "Maine" },
    MD: { short: "MD", long: "Maryland" },
    MA: { short: "MA", long: "Massachusetts" },
    MI: { short: "MI", long: "Michigan" },
    MN: { short: "MN", long: "Minnesota" },
    MS: { short: "MS", long: "Mississippi" },
    MO: { short: "MO", long: "Missouri" },
    MT: { short: "MT", long: "Montana" },
    NE: { short: "NE", long: "Nebraska" },
    NV: { short: "NV", long: "Nevada" },
    NH: { short: "NH", long: "New Hampshire" },
    NJ: { short: "NJ", long: "New Jersey" },
    NM: { short: "NM", long: "New Mexico" },
    NY: { short: "NY", long: "New York" },
    NC: { short: "NC", long: "North Carolina" },
    ND: { short: "ND", long: "North Dakota" },
    OH: { short: "OH", long: "Ohio" },
    OK: { short: "OK", long: "Oklahoma" },
    OR: { short: "OR", long: "Oregon" },
    PA: { short: "PA", long: "Pennsylvania" },
    RI: { short: "RI", long: "Rhode Island" },
    SC: { short: "SC", long: "South Carolina" },
    SD: { short: "SD", long: "South Dakota" },
    TN: { short: "TN", long: "Tennessee" },
    TX: { short: "TX", long: "Texas" },
    UT: { short: "UT", long: "Utah" },
    VT: { short: "VT", long: "Vermont" },
    VA: { short: "VA", long: "Virginia" },
    WA: { short: "WA", long: "Washington" },
    WV: { short: "WV", long: "West Virginia" },
    WI: { short: "WI", long: "Wisconsin" },
    WY: { short: "WY", long: "Wyoming" },
}

export const fStateByLong = (longState: string): string | null => {
    try {
        let shortState = null

        const keys = Object.keys(states)
        let i = 0
        let stop = false

        while (keys.length >= i + 1 && !stop) {
            const stateData = states[keys[i]]
            if (stateData.long === longState) {
                shortState = stateData.short

                stop = true
            }
            i++
        }

        return shortState
    } catch {
        return null
    }
}

