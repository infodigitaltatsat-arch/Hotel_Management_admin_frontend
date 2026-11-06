import {Menu, Bell, UserCircle} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

const AdminLayout = ({children, title})=>{
    const {user, logout} = useAuth();

    return(
        <div className='flex min-h-screen bg-slate-50 rounded-xl '>
            <div className='hidden self-stretch lg:block'>
                <Sidebar onLogout={logout}/>
            </div>

            <div className='flex min-w-0 flex-1 flex-col'>
                <header className='flex items-center justify-between h-20 border-b border-slate-200 bg-white px-5 sm:px-8 rounded-xl shadow-xl'>
                    <div className='flex items-center gap-3'>
                        {/* <button className='rounded-xl p-2 text-slate-600 transition-all hover:scale-105 hover:bg-slate-100 lg:hidden'>
                            <Menu size={22}/>
                        </button> */}
                        <div className=''>
                            <h2 className='text-lg text-blue-600 font-bold '>
                                {title}
                            </h2>
                            <p className='hidden text-sm text-slate-500 sm:block'>
                                Hotel management system 
                            </p>

                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        <button
                        type='button'
                        className='rounded-full p-2 text-blue-500 transition-all hover:scale-105 hover:bg-slate-100'
                        aria-label='Notifications'
                        >
                            <Bell size={20}/>

                        </button>

                        <div className='flex items-center justify-center gap-3 border-1 border-slate-200 px-3 py-1 rounded-xl transition-all hover:scale-105 hover:bg-slate-50'>
                            <UserCircle size={32} className='text-blue-400'/>
                            <div className='sm:block'>
                                <p className='text-sm font-semibold text-blue-600'>
                                    {user?.name}
                                </p>
                                <p className='text-xs capitalize text-slate-500'>
                                    {user?.role}
                                </p>
                            </div>
                        </div>
                    </div>


                </header>
                <main className='flex-1 p-5 sm:p-8'>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AdminLayout;
