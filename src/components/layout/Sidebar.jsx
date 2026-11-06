import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarDays,
    BedDouble,
    Users,
    CreditCard,
    BarChart3,
    Settings,
    Hotel,
    LogOut,
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Reservation', path: '/reservations', icon: CalendarDays },
    { name: 'Rooms', path: '/rooms', icon: BedDouble },
    { name: 'Guests', path: '/guests', icon: Users },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: Settings },
];


const Sidebar = ({ onLogout }) => {
    return (
        <aside className='flex h-full min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-[#0a192f]'>
            <div className='flex h-20 items-center gap-3 border-b border-white/10 px-6'>
                <div className='flex items-center justify-center rounded-xl bg-blue-500 p-3 shadow-lg shadow-blue-950/30'>
                    <Hotel size={23} className="text-white" />
                </div>
                <div className='flex flex-col items-center'>
                    <h1 className='font-bold text-white'>
                        Hotel Manager
                    </h1>
                    <p className='text-sm text-slate-300'>
                        Management Portal
                    </p>
                </div>
            </div>




            <nav aria-label='Main navigation' className='flex-1 space-y-1 overflow-y-auto px-3 py-6'>
                <p className='mb-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>
                    Main Menu
                </p>
                {navigation.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-150 hover:scale-105 ${isActive
                                ? 'bg-blue-500 text-white shadow-md shadow-blue-950/30'
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Icon size={19} className='shrink-0' />
                            {item.name}
                        </NavLink>

                    )
                })}
            </nav>
            <div className='border-t border-white/10 p-4'>
                <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition-colors duration-150 hover:bg-red-500/15 hover:text-red-200">
                    <LogOut size={19} />
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default Sidebar;
