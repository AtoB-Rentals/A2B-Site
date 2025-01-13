import Navbar from "@/components/navbar"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

    return (
        <>
            <Navbar />
            {children}
            <footer className="p-4 bg-neutral text-base-100 text-center mt-8">
              © 2025 A2B Rentals
            </footer>
        </>
    )
}