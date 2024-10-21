
export interface TimeI {
    utc: string
    local: string
    iana: string
    goTime: Date
}

export interface RecordI {
    startTime: TimeI
    endTime: TimeI
}