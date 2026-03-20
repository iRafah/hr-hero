import Navbar from '../components/Navbar.jsx';

function Login() {
    return (
        <div className="min-h-screen">
            {/* Navbar Component */}
            <Navbar />

            <div className="flex justify-center items-center h-screen">
                <div className="w-1/2 hidden md:block bg-white">
                    <img src="g" alt="Placeholder Image" className="w-full h-full" />
                </div>

                <div className="sm:20 p-8 w-full lg:w-1/2 bg-white">
                    <h1 className="text-3xl font-semibold mb-4" style={{ fontFamily: 'sans-serif' }} >Login</h1><br />
                    <form action="#" method="POST" className="w-full max-w-md flex justify-center flex-col">
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-600">Username</label>
                            <input type="text" id="username" name="username" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-600">Password</label>
                            <input type="password" id="password" name="password" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off" />
                        </div>

                        <div className="mb-4 flex items-center">
                            <input type="checkbox" id="remember" name="remember" className="text-blue-500" />
                            <label htmlFor="remember" className="text-gray-600 ml-2">Remember Me</label>
                        </div>

                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
                    </form>

                    <div className="mt-6 text-blue-500">
                        <a href="#" className="hover:underline mr-2">Forgot Password?</a>
                        <a href="#" className="hover:underline">Sign up Here</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
