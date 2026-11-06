
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './routes/ProtectedRoute'
import ReservationsPage from './pages/ReservationPage'
import ReservationDetailsPage from './pages/ReservationDetailsPage'
import RoomsPage from './pages/RoomsPage'
import GuestsPage from './pages/GuestsPage'
import GuestDetailsPage from './pages/GuestDetailsPage'
import PaymentsPage from './pages/PaymentsPage'
import SettingsPage from './pages/SettingsPage'

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>

                <Routes>
                    <Route path='/login' element={<LoginPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path='/dashboard' element={<DashboardPage />} />
                        <Route path='/reservations' element={<ReservationsPage />} />
                         <Route path='/reservations/:id' element={<ReservationDetailsPage />} />
                         <Route path='/rooms' element={<RoomsPage />} />
                         <Route path='/guests' element={<GuestsPage />} />
                         <Route path='/guests/:id' element={<GuestDetailsPage />} />
                          <Route path='/payments' element={<PaymentsPage />} />
                           <Route path='/settings' element={<SettingsPage />} />
                   
                    </Route>
                    <Route path='*' element={<Navigate to='/dashboard' replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
