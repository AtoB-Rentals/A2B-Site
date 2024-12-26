import React from 'react';
import { revalidatePath } from 'next/cache';

const ContactUsPage = () => {

    const handleSubmit = async (formData: FormData) => {
        "use server"

        const name = formData.get('name')?.toString() || '';
        const email = formData.get('email')?.toString() || '';
        const message = formData.get('message')?.toString() || '';

        console.table({ name, email, message });

        // Handle form submission logic here, e.g., save to database, send email, etc.
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        });

        if (!response.ok) {
            console.error('Failed to send email');
            return;
        }

        console.log('Email sent successfully');

        // Revalidate the path to update the page
        revalidatePath('/contact-us');
    };

    return (
        <>
            <div className="text-center">
                <h1 className='text-3xl font-bold text-secondary motion-preset-bounce motion-safe:animate-bounce'>
                    Contact Us
                </h1>
                <p>If you have any questions, feel free to reach out to us!</p>
            </div>
            <form className="max-w-md mx-auto mt-8" action={handleSubmit}>
                <div className="mb-4 motion-preset-slide-right">
                    <label className="block text-md font-bold font-medium text-primary" htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="mt-1 block w-full px-3 py-2 shadow-md rounded-md bg-base-300 focus:outline-none focus:ring-primary focus:shadow-primary sm:text-sm"
                        required
                    />
                </div>
                <div className="mb-4 motion-preset-slide-right motion-delay-500">
                    <label className="block text-md font-bold font-medium text-primary" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block w-full px-3 py-2 shadow-md rounded-md bg-base-300 focus:outline-none focus:ring-primary focus:shadow-primary sm:text-sm"
                        required
                    />
                </div>
                <div className="mb-4 motion-preset-slide-right motion-delay-1000">
                    <label className="block text-md font-bold font-medium text-primary" htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 shadow-md rounded-md bg-base-300 focus:outline-none focus:ring-primary focus:shadow-primary sm:text-sm"
                        required
                    ></textarea>
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 shadow-md text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </>
    );
};

export default ContactUsPage