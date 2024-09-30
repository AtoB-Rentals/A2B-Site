import { ApiRes, apiURL, err, throwError, unknownErr } from "./constants"


export const logout = async () => {
    try {
        const response = await fetch(`${apiURL}/api/users/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            credentials: 'include'
        })

        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }

        return await response.json() as ApiRes<null>
    } catch (e) {
        return unknownErr()
    }
}