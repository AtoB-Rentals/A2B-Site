import React from 'react';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import ContactUsForm from '@/components/contact_us/form';

const ContactUsPage = async () => {

    return (
        <>
            <div className="text-center">
                <h1 className='text-3xl font-bold text-secondary motion-preset-bounce motion-safe:animate-bounce'>
                    Contact Us
                </h1>
                <p>If you have any questions, feel free to reach out to us!</p>
                <p>From booking to partnership questions!</p>
            </div>
            <ContactUsForm />
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