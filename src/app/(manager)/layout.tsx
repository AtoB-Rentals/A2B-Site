import ManNavbar from "@/components/navbar/manager"


export default function ManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>  
      <ManNavbar />
      {children}
    </>
  )
}