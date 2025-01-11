'use client'
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const useModal = ({
    onOk,
    onClose,
    paramKey
}: {
    onOk: () => Promise<boolean | void>,
    onClose?: () => void,
    paramKey: string
}) => {
    const searchParams = useSearchParams()
    const dialogRef = useRef<null | HTMLDialogElement>(null)
    const dialogParam = searchParams.get(paramKey)
    const urlParams = new URLSearchParams(searchParams.toString())
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (dialogParam === 'y') {
            dialogRef.current?.showModal()
        } else {
            dialogRef.current?.close()
        }
    }, [dialogParam])

    const closeDialog = () => {
        dialogRef.current?.close()

        urlParams.delete(paramKey)
        window.history.replaceState({}, '', `?${urlParams.toString()}`)

        onClose && onClose()
    }

    const clickOk = async () => {
        try {
            setLoading(true)
            const res = await onOk()
            if (res === true || res === undefined) {
                closeDialog()
            }
        } catch {
            return
        } finally {
            setLoading(false)
        }
    }

    return {
        dialogRef,
        clickOk,
        dialogParam,
        closeDialog,
        loading,
        setLoading
    }
}

export default useModal