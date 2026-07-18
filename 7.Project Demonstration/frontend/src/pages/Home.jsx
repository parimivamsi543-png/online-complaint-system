import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Online Complaint Registration & Management System
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              Register complaints, track status in real-time, and communicate with assigned agents.
              Fast, transparent, and efficient resolution for every citizen.
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <Link to="/dashboard" className="bg-white text-primary-700 font-semibold py-3 px-6 rounded-lg hover:bg-primary-50 transition-colors">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="bg-white text-primary-700 font-semibold py-3 px-6 rounded-lg hover:bg-primary-50 transition-colors">
                    Get Started
                  </Link>
                  <Link to="/login" className="border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/10 transition-colors">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Register Complaint', desc: 'Submit your complaint with details, category, and location.' },
            { step: '2', title: 'Track Progress', desc: 'Monitor status updates from Pending to Resolved in real-time.' },
            { step: '3', title: 'Get Resolution', desc: 'Receive notifications when agents are assigned and issues are resolved.' },
          ].map((item) => (
            <div key={item.step} className="card text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📝', title: 'Easy Registration', desc: 'Simple form to register complaints' },
              { icon: '🔍', title: 'Track Status', desc: 'Real-time complaint tracking' },
              { icon: '🔔', title: 'Notifications', desc: 'Get updates on your complaints' },
              { icon: '👥', title: 'Agent Support', desc: 'Dedicated agents for resolution' },
            ].map((feature) => (
              <div key={feature.title} className="card">
                <span className="text-3xl mb-3 block">{feature.icon}</span>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          © 2026 Complaint Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
