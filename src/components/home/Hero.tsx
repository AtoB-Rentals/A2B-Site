import Image from 'next/image'

const Hero = () => {

    return (
        <section className="relative h-lvh overflow-hidden">
            <div className="p-2 md:max-w-4xl md:max-h-96 absolute z-10 top-2/4 -translate-y-2/4 left-14">
                <h2 className="text-center font-bold text-6xl text-neutral-800 md:text-left mb-4">
                    We Have Prepared a Car For Your Trip
                </h2>
                <p className="text-neutral-700 text-xl text-center md:w-[70%] mb-4 md:text-left">
                    We have many types of cars that are ready 
                    for you to travel anywhere and anytime.
                </p>
                <div className='flex gap-x-2 justify-center md:justify-start'>
                    <button className='text-neutral-100 p-4 border border-orange-500 bg-orange-500'>
                        Get In Touch
                    </button>
                    <button className='p-4 text-neutral-900 border border-neutral-900'>
                        Get In Touch
                    </button>
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
                className='absolute top-[20%] right-4 z-0 hidden md:block'
            />
        </section>
    )
}

export default Hero