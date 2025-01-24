import ContactUsForm from "@/components/contact_us/form"
import Link from "next/link"


const page = () => {

    return (
        <main>
            <section className="p-7 mx-auto max-w-4xl rounded-2xl bg-base-300 motion-preset-slide-down-md">
                <h1 className="text-center text-2xl text-secondary font-bold">React</h1>
                <h2 className="text-center text-lg text-secondary font-bold italic">Dumb Dumb DOM</h2>
                <p className="text-justify">
                    HTML, CSS, and Javascript are the three core technologies for building Web pages. But what about web applications? Well, earlier in the days of web development, websites would become these huge monoliths that were not modular and difficult to maintain. 
                </p>
                <p className="text-justify inset-5 mt-4">
                    Another problem was that the DOM (Document Object Model) was not made for constant changes and updates. The DOM would essential refresh the page everytime an update was made. This would cause a so and non-user friendly experience for the user. React came in as a solution to the problem. It modularized section of your website by using what's known as component. And it created a "Virtual DOM" that would allow updates without refreshing the entire page. Only rerending the section at the component level. 
                </p>
                <p className="mt-4 indent-5 text-justify">

                </p>
            </section>

            <section className="p-7 mx-auto max-w-xl rounded-2xl border-2 border-primary mt-4 motion-preset-slide-down-md">
                <ContactUsForm />
            </section>

            <section className="p-7 mx-auto max-w-4xl rounded-2xl bg-base-300 motion-preset-slide-down-md mt-4">
                <h2 className="text-center text-lg text-secondary font-bold italic">Explanation</h2>
                <p className="text-justify">
                    The "Contact Us" form above is a simple example of how React works. The form is made up of several components, each responsible for a specific part of the form. The "ContactUsForm" component is the main component that holds the state of the form and handles the submission. The "InputField" component is a reusable component that renders an input field with a label. The "Button" component is another reusable component that renders a button. Notice the layer of abstraction. The "ContactUsForm" does not necessarily belog on this page nor handles the state inside it. Yet it still was put here using one singular line of code.
                </p>
            </section>

            <Link href="/bofa-interview/advance-promises" className="btn btn-lg btn-error fixed bottom-5 left-5">
                Previous: Advanced Promises
            </Link>
            {/* <Link href="/bofa-interview/" className="btn btn-lg btn-success fixed bottom-5 right-5">
                Next: Advance Promises
            </Link> */}
        </main>
    )
}

export default page