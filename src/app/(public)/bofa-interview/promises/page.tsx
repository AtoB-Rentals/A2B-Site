import Link from "next/link"

const Promises = () => {
    

    return (
        <main>
            <section className="p-7 mx-auto max-w-4xl rounded-2xl bg-base-300 motion-preset-slide-down-md">
                <h1 className="text-center text-2xl text-secondary font-bold">Let talk about Promises</h1>
                <h2 className="text-center text-lg text-secondary font-bold italic">(This is not using ChatGPT)</h2>
                <p
                    className="text text-justify-center mt-4"
                >Promises were created as a method for javascript to use as a solution for asynchronous operations. It was first introduced in ECMAScript 2015 and it provided javascript developers to create more efficient, unblocking code. It wasn't a flawless solution however, its syntax created what's known as "Call Back Hell" as seen in my previous example. "Call Back Hell" happens when using the "then" method to do the next step after the asynchronous operation. However, people found themselves creating a staircase of incapsulated structions in their code. This made their code unclean, and uneasy to work with</p>

                <h3 className="text text-left text-lg text-secondary font-bold mt-4">The Updated Solution</h3>
                <p
                    className="text text-justify-center mt-4"
                >"async await" was would then come in to create a symantically cleaner adaptation to handling promises. By adding the "async" keyword to a function, it signifies that the function will return (or handle) a promise. This would be a game changer because now if you want to create the next step after the asynchronous operation, you could then just add the "await" keyword in front of it.</p>
            </section>

            <Link href="/bofa-interview/" className="btn btn-lg btn-error fixed bottom-5 left-5">
                Previous: Welcome
            </Link>
            <Link href="/bofa-interview/advance-promises" className="btn btn-lg btn-success fixed bottom-5 right-5">
                Next: Advance Promises
            </Link>
        </main>
    )
}

export default Promises 