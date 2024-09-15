'use client'
import { ApiRes, apiURL, err, throwError, unknownErr } from "./constants";
import { AddCarI, AddCarSchema, CarI, PictureTypeT } from '../../interface/api/car';
import {useCookies} from 'next-client-cookies'

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
        const response = await fetch(`${apiURL}/api/manager/cars/add`, { // Replace '/api/login' with your actual login endpoint
            method: 'POST',
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

export const addCarPic = async (
    carId: string, 
    image: File,
    type: PictureTypeT
): Promise<ApiRes<CarI> | err> => {
    try {
        const formData = new FormData()
        console.log('type: ', type)
        formData.set('type', type)
        // formData.append('image', image)

        const fileBlob = new Blob([image])
        formData.append("image", fileBlob, image.name);

        const response = await fetch(`${apiURL}/api/manager/cars/car/${carId}/add_picture`, { // Replace '/api/login' with your actual login endpoint
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
        const response = await fetch(`${apiURL}/api/manager/cars/car/${carId}/pictures`, { // Replace '/api/login' with your actual login endpoint
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
        console.log("err: ", e)
        return unknownErr()
    }
}

export const getCar = async (carId: string): Promise<ApiRes<CarI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/cars/car/${carId}`, { // Replace '/api/login' with your actual login endpoint
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

        return await response.json() as ApiRes<CarI>
    } catch (e) {
        return unknownErr()
    }
}