'use client'

import { apiURL } from "@/constants/requests/constants"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

const ContactUsForm = () => {
    const session = useSession()
    const userEmail = session.data?.user.email || ''
    const userName = session.data?.user.name || ''
    const [ status, setStatus ] = useState<'success' | 'server_fail' | 'bad data' | null>(null)

    const handleSubmit = async (formData: FormData) => {
        const name = formData.get('name')?.toString() || '';
        const email = formData.get('email')?.toString() || '';
        const message = formData.get('message')?.toString() || '';
        const subject = formData.get('subject')?.toString() || '';;

        // Handle form submission logic here, e.g., save to database, send email, etc.
        const response = await fetch(`${apiURL}/api/users/contact-us`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message, subject }),
        })

        if (!response.ok) {
            if (response.status >= 400 && response.status < 500) {
                setStatus('bad data')
            }

            if (response.status >= 500) {
                setStatus('server_fail')
            }
            return;
        }

        setStatus('success')
    }

    if (status === 'success') {
        return (
            <div className="text-center my-12 motion-preset-confetti">
                <h2 className="text-2xl font-bold text-success">Message Sent!</h2>
                <p className="">We will get back to you as soon as possible.</p>
                <Link 
                    className="btn btn-primary my-4"
                    href="/"
                >Go To Home</Link>
            </div>
        )
    }

    if (status === 'bad data') {
        return (
            <div className="text-center my-12 motion-preset-slide-right">
                <h2 className="text-2xl font-bold text-error">Failed to send message</h2>
                <p className="text-secondary">Please check your input and try again.</p>
                <button 
                    className="btn btn-primary my-4"
                    onClick={() => setStatus(null)}
                >Try again</button>
            </div>
        )
    }

    if (status === 'server_fail') {
        return (
            <div className="text-center my-12 motion-preset-slide-right">
                <h2 className="text-2xl font-bold text-error">Failed to send message</h2>
                <p className="text-secondary">Please try again later.</p>
            </div>
        )
    }

    return (
        <form className="max-w-md mx-auto px-2 md:px-0 mt-8 " action={handleSubmit}>
            <div className="mb-4 motion-preset-slide-right">
                <label className="block text-md font-bold text-primary" htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-1 block w-full px-3 py-2 shadow-md rounded-md bg-base-300 focus:outline-none focus:ring-primary focus:shadow-primary sm:text-sm"
                    defaultValue={userName}
                    required
                />
            </div>
            <div className="mb-4 motion-preset-slide-right motion-delay-150">
                <label className="block text-md font-bold text-primary" htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full px-3 py-2 shadow-md rounded-md bg-base-300 focus:outline-none focus:ring-primary focus:shadow-primary sm:text-sm"
                    defaultValue={userEmail}
                    required
                />
            </div>
            <div className="mb-4 motion-preset-slide-right motion-delay-300">
                <label className="block text-md font-bold text-primary" htmlFor="subject">Subject</label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="mt-1 block w-full px-3 py-2 shadow-md rounded-md bg-base-300 focus:outline-none focus:ring-primary focus:shadow-primary sm:text-sm"
                    required
                />
            </div>
            <div className="mb-4 motion-preset-slide-right motion-delay-[450ms]">
                <label className="block text-md font-bold text-primary" htmlFor="message">Message</label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 shadow-md rounded-md bg-base-300 focus:outline-none focus:ring-primary focus:shadow-primary sm:text-sm"
                    required
                    maxLength={500}
                ></textarea>
                <p className="text-sm text-right text-secondary">Max 500 characters</p>
            </div>
            <div className="text-center">
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 shadow-md text-sm rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Submit
                </button>
            </div>
        </form>
    )
}

export default ContactUsForm