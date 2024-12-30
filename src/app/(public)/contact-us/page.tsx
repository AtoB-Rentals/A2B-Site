import React from 'react';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import { apiURL } from '@/constants/requests/constants';
import { authOptions } from '@/app/api/utils/authOptions';

const ContactUsPage = async () => {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || '';
    const userName = session?.user?.name || '';

    console.log('User email:', userEmail);

    const handleSubmit = async (formData: FormData) => {
        "use server"

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
                <p>From booking to partnership questions!</p>
            </div>
            <form className="max-w-md mx-auto px-2 md:px-0 mt-8 " action={handleSubmit}>
                <div className="mb-4 motion-preset-slide-right">
                    <label className="block text-md font-bold font-medium text-primary" htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="mt-1 block w-full px-3 py-2 shadow-md rounded-md bg-base-300 focus:outline-none focus:ring-primary focus:shadow-primary sm:text-sm"
                        defaultValue={userName}
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
                        defaultValue={userEmail}
                        required
                    />
                </div>
                <div className="mb-4 motion-preset-slide-right">
                    <label className="block text-md font-bold font-medium text-primary" htmlFor="name">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
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
            <section className='flex md:flex-row flex-col justify-around items-center mt-8 text-center gap-8 md:gap-0 max-w-4xl mx-auto'>
                <div className='flex flex-col items-center px-8 max-w-sm motion-preset-slide-right-lg'>
                    <Image 
                        src='/images/mail.png'
                        alt='email icon'
                        width={50}
                        height={50}
                    />
                    <h3 className='text-lg font-bold text-primary'>
                        Email Us:
                    </h3>
                    <p className='opacity-80'>
                        Email us for general queries, including marketing and partnership opportunities.
                    </p>
                    <Link href="mailto:rent@atob.rentals" className='link link-primary text-lg font-bold'>
                        Rent@atob.rentals
                    </Link>
                </div>
                <div className='flex flex-col items-center px-8 max-w-sm motion-preset-slide-left-lg'>
                    <Image
                        src='/images/phone.png'
                        alt='email icon'
                        width={50}
                        height={50}
                    />
                    <h3 className='text-lg font-bold text-primary'>
                        Call Us:
                    </h3>
                    <p className='opacity-80'>
                        Call us to speak to a member of our team. We are always happy to help
                    </p>
                    <Link href="tel:+19802063002" className='link link-primary text-lg font-bold'>
                        (980) 206-3002
                    </Link>
                </div>
                
            </section>
        </>
    );
};

export default ContactUsPage