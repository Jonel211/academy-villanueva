import { useState } from 'react';
import Instructores from './components/Instructores';
import Talleres from './components/Talleres';

export default function App() {
  const [tab, setTab] = useState('talleres');

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar estático modificado aquí */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="w-full px-4 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-black text-indigo-700 tracking-wide mb-4 md:mb-0">ACADEMIA VILLANUEVA</h1>
          <nav className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setTab('talleres')} 
              className={`px-6 py-2 rounded-md font-medium transition-all ${tab === 'talleres' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Talleres
            </button>
            <button 
              onClick={() => setTab('instructores')} 
              className={`px-6 py-2 rounded-md font-medium transition-all ${tab === 'instructores' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Instructores
            </button>
          </nav>
        </div>
      </header>

      {/* Contenedor principal expandido */}
      <main className="w-full px-4 md:px-12 py-8">
        {tab === 'talleres' ? <Talleres /> : <Instructores />}
      </main>
    </div>
  );
}
