import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {

    return (
        <section className="relative h-lvh overflow-hidden">
            <div className="p-2 md:max-w-4xl md:max-h-96 absolute z-10 top-2/4 -translate-y-2/4 left-[50%] -translate-x-2/4 w-full md:w-[80%] md:translate-x-0 md:left-14">
                <h2 className="text-center font-bold text-6xl md:text-left mb-4 text-primary">
                    We Have Prepared a Car For Your Trip
                </h2>
                <p className=" text-xl text-center md:w-[70%] mb-4 md:text-left text-secondary">
                    We have many types of cars that are ready 
                    for you to travel anywhere and anytime.
                </p>
                <div className='flex gap-x-2 justify-center md:justify-start'>
                    <Link href='/rentals' className='btn btn-accent'>
                        Our Cars
                    </Link>
                    <a href="tel:+19802063002" className='btn btn-secondary p-4 border btn-outline'>
                        Get In Touch
                    </a>
                </div>
            </div>
            <Image 
                src="/images/Map.png"
                alt='Picture of world map'
                width={1000}
                height={1000}
                className='w-[60%] absolute right-0 z-0 hidden md:block'
            />
            <Image 
                src="/images/white_angled_camry.png"
                alt='Picture of world map'
                width={800}
                height={600}
                className='absolute top-[20%] right-4 z-0 hidden lg:block motion-preset-slide-left delay-200'
            />
        </section>
    )
}

export default Hero