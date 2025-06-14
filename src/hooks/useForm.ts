import { useEffect, useLayoutEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import z, { ZodType } from 'zod'

type InputEvents = React.ChangeEvent<
    HTMLInputElement |
    HTMLTextAreaElement |
    HTMLSelectElement
>

type FormValues = { [keys: string]: string }

const useBasicFormHook = <T extends FormValues>(
    Schema: ZodType<T>,
    initialValues: T,
    onSubmit?: () => void,
    queryKey = 'form'
) => {
    const [values, setValues] = useState(initialValues)
    const [errs, setErrs] = useState<{ [keys: string]: string }>({})
    const [isValid, setIsValid] = useState<boolean>(false)
    const searchParams = useSearchParams()

    useLayoutEffect(() => {
        if (queryKey) {
            const urlParams = new URLSearchParams(searchParams.toString())
            const formDataString = urlParams.get(queryKey)
            if (formDataString) {
                try {
                    const decodedFormData = JSON.parse(formDataString)
                    let preValues: FormValues = {}
                    for (const key in decodedFormData) {
                        if (key in initialValues) {
                            preValues[key] = decodedFormData[key]
                        }
                    }

                    setValues(pre => ({
                        ...pre,
                        ...preValues
                    }))
                } catch (error) {
                    console.error('Error parsing form data from URL:', error)
                }
            }
        }
    }, [])

    const validateValues = () => {
        try {
            Schema.parse(values)
            setErrs({})
            return true
        } catch (e: any) {
            let theErrs: { [key: string]: string } = {}

            if (e instanceof z.ZodError) {
                for (let theErr of e.issues) {
                    theErrs[theErr.path[0]] = theErr.message
                }
            }

            setErrs(theErrs)
        }
    }

    useEffect(() => {
        setIsValid(Schema.safeParse(values).success)
    }, [values])

    const updateValues = (e: InputEvents) => {
        e.preventDefault()
        const { id, value } = e.target
        setValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }))
    }

    const updateParamsJSON = () => {
        const urlParams = new URLSearchParams(searchParams.toString())
        const formDataString = urlParams.get(queryKey)

        if (formDataString) {
            const decodedFormData = JSON.parse(formDataString)
            urlParams.set(queryKey, JSON.stringify({
                ...decodedFormData,
                ...values
            }))

            window.history.replaceState({}, '', `?${urlParams.toString()}`)
            return urlParams.toString()
        } else {
            urlParams.set(queryKey, JSON.stringify(values))
            window.history.replaceState({}, '', `?${urlParams.toString()}`)
            return urlParams.toString()
        }
    }

    const updateParams = (updateURL: boolean = true) => {
        const urlParams = new URLSearchParams(searchParams.toString());

        // Iterate over the 'values' object and update query parameters accordingly
        Object.keys(values).forEach((key) => {
            if (values[key] !== undefined && values[key] !== null) {
                urlParams.set(key, values[key]);
            } else {
                urlParams.delete(key); // Remove the key if the value is null/undefined
            }
        })

        // Update the URL without refreshing the page
        updateURL && window.history.replaceState({}, '', `?${urlParams.toString()}`);
        return urlParams.toString();
    };

    function clearValues() {
        setValues(() => ({ ...initialValues }))
    }

    return {
        values,
        updateValues,
        errs,
        setErrs,
        validateValues,
        updateParams,
        isValid,
        setValues,
        clearValues
    }
}

export default useBasicFormHook
