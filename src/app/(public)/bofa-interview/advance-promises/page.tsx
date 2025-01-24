'use client'
import Loading from "@/components/assets/loading";
import Link from "next/link"
import { useState } from "react";


const AdvancedPromises = () => {
    const [data, setData] = useState<any>()
    const [loading, setLoading] = useState<boolean>(false)

    const waitToWin = (win: boolean, time: number) => new Promise((res, err) => {
        setTimeout(() => win ? res("WIN") : err("Lose"), time);
    })

    const waiters = [
        waitToWin(true, 1000), 
        waitToWin(false, 2000), 
        waitToWin(true, 3000)
    ]

    const all = Promise.all(waiters)

    const allSettled = Promise.allSettled(waiters)

    const triggerAll = async () => {
        try {
            setLoading(true)
            setData(null)
            const res = await all
    
            setData(res)

        } catch(e) {
            setData(e)
        } finally {
            setLoading(false)
        }
    }

    const triggerAllSettled = async () => {
        try {
            setLoading(true)
            setData(null)
            const res = await allSettled

            setData(res.map(d => d.status === "fulfilled" ? d.value : d.reason))
        } catch {
            console.error('this will never happen')
        } finally {
            setLoading(false)
        }

    }


    return (
        <main>
            <section className="p-7 mx-auto max-w-4xl rounded-2xl bg-base-300 motion-preset-slide-down-md">
                <h1 className="text-center text-2xl text-secondary font-bold">Advanced Promises</h1>
                <h2 className="text-center text-lg text-secondary font-bold italic">I Promised You All...</h2>
                <p className="text-justify">Okay we know how promises operate now. We know where they came from. However, what about if we want to handle multiple promises. This is where "Promise.all()" comes in. "Promise.all()" takes in an array of promises and will run them all at the same time. This makes your code more unblocking by allowing not creating a non-sequential way starting asynchronously operation. This is also especially good for when you have an unknown number of promises you want to run.</p>
                <h2 className="text-center text-lg text-secondary font-bold italic mt-4">Let's All Get Settled In</h2>
                <p className="text-justify">One major caveat to the running "Promise.all()" is that it'll cancel all operations whenver a single Promise is rejected. Let's say you want to update the database for changes in node.js and also send an email at the same time. You wouldn't well now if the email fails your database will not be updated. That can cause major problems if the database update was the most important operation and you don't care if the email is sent.</p>

                <p className="mt-4 indent-5 text-justify">"Promise.allSettled()" comes as new method that would instead wait until all promises finish (resolved or rejected). Similar to "Promise.all()", "Promise.allSettled()" returns the results back as an array with the only difference that each result is displayed as: 
                
                <pre className="rounded-md bg-base-300">{`{status: "fulfilled" | "reject",  value: (if fulfilled), reason: (if rejected)}`}</pre></p>

                <p className="mt-4">Here's an example explain them:</p>

                <div className="flex justify-center gap-4 mt-4">
                    <button 
                        className="btn btn-secondary"
                        onClick={() => triggerAll()}
                    >
                        Promise.all()
                    </button>
                    <button 
                        className="btn btn-success"
                        onClick={() => triggerAllSettled()}
                    >
                        Promise.allSettled()
                    </button>
                    {data &&<button 
                        className="btn btn-error motion-preset-slide-left-md"
                        onClick={() => setData(null)}
                    >
                        Clear
                    </button>}
                </div>
            </section>

            {loading && <Loading />}

            {data && <section className="p-7 mx-auto max-w-4xl rounded-2xl bg-base-300 motion-preset-slide-down-md mt-4">
                <pre>
                    {JSON.stringify(data)}
                </pre>
            </section>}

            <Link href="/bofa-interview/promises" className="btn btn-lg btn-error fixed bottom-5 left-5">
                Previous: Promises
            </Link>
            <Link href="/bofa-interview/react" className="btn btn-lg btn-success fixed bottom-5 right-5">
                Next: React
            </Link>
        </main>
    )
}

export default AdvancedPromises