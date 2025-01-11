"use client"
import { useSearchParams } from 'next/navigation'
import { useRef, useEffect, Suspense } from 'react'

type Props = {
    title: string,
    onClose?: () => void,
    onOk: () => Promise<boolean> | boolean,
    children: React.ReactNode,
    paramKey: string
    loading: boolean
}

export default function FormModal({ 
    title, 
    onClose, 
    onOk, 
    children,
    paramKey,
    loading
}: Props) {
    const searchParams = useSearchParams()
    const dialogRef = useRef<null | HTMLDialogElement>(null)
    const showDialog = searchParams.get(paramKey)
    const urlParams = new URLSearchParams(searchParams.toString())

    useEffect(() => {
        if (showDialog === 'y') {
            dialogRef.current?.showModal()
        } else {
            dialogRef.current?.close()
        }
    }, [showDialog])

    const closeDialog = () => {
        dialogRef.current?.close()
        
        urlParams.delete(paramKey)
        window.history.replaceState({}, '', `?${urlParams.toString()}`)

        onClose && onClose()
    }

    const clickOk = async () => {
        try {
            const res = await onOk()
            if (res === true || res === undefined) {
                closeDialog()
            }
        } catch {
            return
        }
    }

    const dialog: JSX.Element | null = showDialog === 'y'
        ? (
            <Suspense>
                <dialog ref={dialogRef} className="fixed top-50 left-50 -translate-x-50 -translate-y-50 rounded-xl backdrop:bg-gray-800/50 border border-blue-500 w-full md:w-[100vh] max-h-[75vh] motion-preset-fade-lg">
                    <div className="flex flex-col justify-between">
                        <div className="flex flex-row justify-between items-center pt-2 px-5 bg-neutral-800 text-white">
                            <h1 className="text-xl whitespace-pre-wrap overflow-hidden">{title}</h1>
                            <button
                                onClick={closeDialog}
                                className="mb-2 py-1 px-2 cursor-pointer rounded border-none w-8 h-8 font-bold text-white"
                            >
                                <span className='bg-red-500 w-5 h-1 rounded-full block ${spanOne} transition-all rotate-45 translate-y-[2px]'></span>
                                <span className='bg-red-500 w-5 h-1 rounded-full block ${spanOne} transition-all -rotate-45 translate-y-[-2px]'></span>
                            </button>
                        </div>
                        <form className='relative overflow-y-auto h-64'>
                            {loading && <div className='w-full h-full bg-slate-500/90 flex items-center justify-center'>
                                <p>Loading...</p>
                            </div>
                            }
                            {children}
                        </form>
                        <div className="flex flex-row justify-center gap-x-5 bg-neutral-800 py-2">
                            <button
                                onClick={closeDialog}
                                className="bg-red-500 w-16 py-1 px-2 rounded border-none"
                            >
                                No
                            </button>
                            <button
                                onClick={clickOk}
                                className="bg-lime-500 w-16 py-1 px-2 rounded border-none"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </dialog>
            </Suspense>
        ) : null


    return dialog
}