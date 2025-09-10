import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HospitalList from './pages/HospitalList';
import HospitalListTable from './pages/HospitalListTable';
import CreateHospital from './pages/CreateHospital';
import UpdateHospital from './pages/UpdateHospital';
import HospitalDetail from './pages/HospitalDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HospitalList />} />
            <Route path="/hospitals" element={<HospitalList />} />
            <Route path="/hospitals/table" element={<HospitalListTable />} />
            <Route path="/hospitals/create" element={<CreateHospital />} />
            <Route path="/hospitals/edit/:id" element={<UpdateHospital />} />
            <Route path="/hospital/:id" element={<HospitalDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
