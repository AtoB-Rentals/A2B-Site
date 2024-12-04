import { ReqUserI, UserI } from "@/interface/api/user"
import { ApiRes, apiURL, err, throwError, unknownErr } from "./constants"

export const CreateUser = async (req: ReqUserI): Promise<ApiRes<string> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(req)
        })

        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }
        return await response.json() as ApiRes<string>
    } catch (e) {
        return unknownErr()
    }
}

export const GetUserProfile = async (): Promise<ApiRes<UserI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/users/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

        return await response.json() as ApiRes<UserI>
    } catch (e) {
        return unknownErr()
    }
}

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