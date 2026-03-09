import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ImageUpload from './pages/ImageUpload';
import About from './pages/About';
import Contact from './pages/Contact';


// Dashboard Subpages
import Overview from './pages/dashboard/Overview';
import DiseaseName from './pages/dashboard/DiseaseName';
import Precautions from './pages/dashboard/Precautions';
import Summary from './pages/dashboard/Summary';
import ConfidenceScore from './pages/dashboard/ConfidenceScore';
import DietPlan from './pages/dashboard/DietPlan';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="login" element={<Login />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="register" element={<Register />} />
                </Route>

                {/* Protected Routes (Simulated) */}
                <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />

                {/* Dashboard Routes */}
                <Route path="/upload" element={<MainLayout><ImageUpload /></MainLayout>} />

                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Overview />} />
                    <Route path="disease" element={<DiseaseName />} />
                    <Route path="precautions" element={<Precautions />} />
                    <Route path="summary" element={<Summary />} />
                    <Route path="confidence" element={<ConfidenceScore />} />
                    <Route path="diet" element={<DietPlan />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
