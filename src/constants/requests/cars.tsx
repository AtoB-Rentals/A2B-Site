'use client'
import { ApiRes, apiURL, err, throwError, unknownErr } from "./constants";
import { AddCarI, CarI, CarStatusT, PictureTypeT, transmissions, TransmissionT } from '../../interface/api/car';
import { ReqAddressI } from "@/interface/api/address";

export const getCars = async (): Promise<ApiRes<CarI[]> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/cars`, { // Replace '/api/login' with your actual login endpoint
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }

        return await response.json() as ApiRes<CarI[]>
    } catch (e) {
        return unknownErr()
    }
}

export const addCar = async (newCar: AddCarI): Promise<ApiRes<CarI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/manager/cars/add`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCar)
        })

        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }

        return await response.json() as ApiRes<CarI>
    } catch (e) {
        console.log("err: ", e)
        return unknownErr()
    }
}

export const setProfilePic = async (
    carId: string, 
    publicId: string
): Promise<ApiRes<CarI> | err> => {
    try {
        publicId = encodeURIComponent(publicId)
        const response = await fetch(`${apiURL}/api/manager/cars/car/${carId}/picture/${publicId}/set_profile_pic`, {
            method: 'POST',
            credentials: 'include',
        })

        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }

        return await response.json() as ApiRes<CarI>
    } catch (e) {
        console.log("err: ", e)
        return unknownErr()
    }
}

export const addCarPic = async (
    carId: string, 
    image: File,
    type: PictureTypeT
): Promise<ApiRes<CarI> | err> => {
    try {
        const formData = new FormData()
        formData.set('type', type)

        const fileBlob = new Blob([image])
        formData.append("image", fileBlob, image.name);

        const response = await fetch(`${apiURL}/api/manager/cars/car/${carId}/add_picture`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })

        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }

        return await response.json() as ApiRes<CarI>
    } catch (e) {
        console.log("err: ", e)
        return unknownErr()
    }
}

export const delCarPics = async (
    carId: string,
    publicIds: string[]
): Promise<ApiRes<CarI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/manager/cars/car/${carId}/pictures`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publicIds
            })
        })

        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }

        return await response.json() as ApiRes<CarI>
    } catch (e) {
        return unknownErr()
    }
}

export const getCar = async (carId: string): Promise<ApiRes<CarI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/cars/car/${carId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }

        return await response.json() as ApiRes<CarI>
    } catch (e) {
        return unknownErr()
    }
}

export const upateCarStatus = async (carId: string, status: CarStatusT): Promise<ApiRes<CarI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/manager/cars/car/${carId}/status/${status}`, {
            method: 'POST',
            credentials: 'include',
        })

        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }

        return await response.json() as ApiRes<CarI>
    } catch (e) {
        return unknownErr()
    }
}

export const upateTransmission = async (carId: string, transmission: TransmissionT): Promise<ApiRes<CarI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/manager/cars/car/${carId}/transmission/${transmission}`, {
            method: 'POST',
            credentials: 'include',
        })

        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }

        return await response.json() as ApiRes<CarI>
    } catch (e) {
        return unknownErr()
    }
}

export const UpatePassengers = async (carId: string, passengers: number): Promise<ApiRes<CarI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/manager/cars/car/${carId}/passengers`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({passengers})
        })

        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }

        return await response.json() as ApiRes<CarI>
    } catch (e) {
        return unknownErr()
    }
}

export const updateCarAddress = async (carId: string, address: ReqAddressI): Promise<ApiRes<CarI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/manager/cars/car/${carId}/address`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...address})
        })

        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }

        return await response.json() as ApiRes<CarI>
    } catch (e) {
        return unknownErr()
    }
}
export const updateCarPrice = async (carId: string, price: number): Promise<ApiRes<CarI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/manager/cars/car/${carId}/price`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({price})
        })

        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }

        return await response.json() as ApiRes<CarI>
    } catch (e) {
        return unknownErr()
    }
}