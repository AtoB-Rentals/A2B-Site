import SignUpForm from "@/components/auth/SignUpForm"


const SignUpPage = () => {

    return (
        <main
            className="w-full flex flex-col items-center justify-center min-h-screen py-2"
        >
            <div
                className="flex flex-col items-center w-2/3 p-10 shadow-md"
            >
                <h1
                    className="mt-10 mb-4 text-4xl font-bold text-secondary"
                >
                    Sign Up
                </h1>
                <SignUpForm />
            </div>
        </main>
    )
}

export default SignUpPage