import GoogleBttn from "@/components/auth/google"
import { CredentialsForm } from "@/components/auth/LoginForm"


const Login = () => {
    
    return (
        <main
            className="w-full flex flex-col items-center justify-center min-h-screen py-2"
        >
            <div
                className="flex flex-col items-center w-full mx-4 md:w-1/3 p-10 shadow-md"
            >
                <h1
                    className="mt-10 mb-4 text-4xl font-bold"
                >
                    Sign In
                </h1>
                <GoogleBttn />
                <CredentialsForm />
            </div>
        </main>
    )
}

export default Login