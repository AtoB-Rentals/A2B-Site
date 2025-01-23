"use client"

import Loading from "@/components/assets/loading";
import { apiURL } from "@/constants/requests/constants"
import { UserI } from "@/interface/api/user"
import { useState } from "react"
import { set } from 'zod';

const BofA = () => {
    const [userData, setUserData] = useState<UserI | null>(null)
    const [loading, setLoading] = useState(false)

    class ApiService {
        apiURL: string;

        constructor(apiURL: string) {
            this.apiURL = apiURL   
        }

        getUserEs6 = async () => {
            setLoading(true)
            setUserData(null)
            await new Promise(resolve => setTimeout(resolve, 1000))
    
            try {
    
                const res = await fetch(`${this.apiURL}/api/users/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                })
        
                if (!res.ok) {
                    if (res.status === 401) return alert("You might want to log in")
    
                    if (res.status >= 500) throw "Something went wrong. Please try again later."
                    
                    const data = await res.json()
                    return alert(`status:${res.status}, message${data.message}`)
                }
        
                const data = await res.json()
        
                setUserData(data.data)
            } catch(error) {
                alert(error)
            }finally {
                setLoading(false)
            }
        }
        
        getUserEs5() {
            setLoading(true)
            setUserData(null)

            setTimeout(function() {
                fetch(apiURL + '/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                }).then(function(res) {
                    if (!res.ok) {
                        if (res.status === 401) {
                            alert("You might want to log in");
                            return;
                        }

                        if (res.status >= 500) {
                            throw "Something went wrong. Please try again later.";
                        }

                        return res.json().then(function(data) {
                            alert('status:' + res.status + ', message' + data.message);
                        });
                    }

                    return res.json();
                }).then(function(data) {
                    if (data) {
                        setUserData(data.data);
                    }
                }).catch(function(error) {
                    alert(error);
                }).finally(function() {
                    setLoading(false);
                });
            }.bind(this), 1000);
        }
    }

    const { getUserEs6, getUserEs5 } = new ApiService(apiURL)

    return (
        <main>
            <section className="p-7 mx-auto max-w-4xl rounded-2xl bg-base-300">
                <h1 className="text-center text-2xl text-secondary font-bold">Hello Bank of America!</h1>
                <p
                    className="text text-justify-center mt-4"
                >I was told that you guys were having trouble finding candidates that were compotent in javascript. Specifically in using promises. Throughout the application, I use "es6's async await" way of handling promises so I have plenty of examples to show you for that. However, I don't use es5's promises. Here's an example of me using it here.</p>
                {userData && <p className="text text-justify-center text-secondary mt-4"></p>}

                <div className="flex justify-center gap-4 mt-4">
                    <button className="btn btn-secondary" onClick={() => getUserEs5()}>Get User</button>
                    <button className="btn btn-success " onClick={() => getUserEs6()}>Get User (es6)</button>
                    <button className="btn btn-error" onClick={() => setUserData(null)}>Clear</button>
                </div>
            </section>
            
            {loading && <Loading />}

            {userData && <section className="mt-4 p-7 mx-auto max-w-4xl rounded-2xl bg-base-300 motion-preset-slide-right-md">
                <h1 className="text-center text-2xl text-secondary font-bold">User Data</h1>
                <pre className="whitespace-pre-wrap">{JSON.stringify(userData, null, 2)}</pre>
            </section>}
        </main>
    )
}

export default BofA