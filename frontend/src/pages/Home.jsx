import { Link } from 'react-router-dom';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="min-h-[calc(100vh-56px)]">
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Online Complaint Registration & Management
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Register complaints, track status, and get updates from assigned agents — all in one
            place.
          </p>
          {user ? (
            <Link
              to="/dashboard"
              className="inline-block bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-3 gap-8">
        {[
          {
            title: 'Register Complaints',
            desc: 'Submit complaints with category, location, and priority details.',
          },
          {
            title: 'Track Status',
            desc: 'Monitor complaint progress from Pending to Resolved in real time.',
          },
          {
            title: 'Agent Communication',
            desc: 'Get notified when agents are assigned and status changes occur.',
          },
        ].map((feature) => (
          <div key={feature.title} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
