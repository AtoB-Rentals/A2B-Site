'use client'
import Hero from "@/components/home/Hero"
import dynamic from "next/dynamic";

const BookNow = dynamic(() => import("@/components/home/BookNow"), {ssr: false})

export default function Home() {
  return (
    <main className="">
      <Hero />
      <BookNow />
    </main>
  );
}
