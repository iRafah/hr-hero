import Navbar from '../components/Navbar.jsx';

function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-gray-900">Your Content Here</h1>
                    <p className="mt-4 text-gray-600">
                        The navbar is ready to be integrated into your React app.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;