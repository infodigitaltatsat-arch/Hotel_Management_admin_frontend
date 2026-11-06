import { User, ShieldCheck, LogOut } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'
import { useAuth } from '../context/AuthContext'

const SettingsPage = () => {
    const { user, logout } = useAuth();

    return (
        <AdminLayout title="Settings">
            <div className='mx-auto max-w-3xl space-y-6'>

                <div className=''>
                    <h2 className='text-xl font-bold text-blue-500'>
                        General Settings
                    </h2>
                    <p className='text-sm text-slate-500'>
                        Manage your account information and preference.
                    </p>
                </div>

                <section className='rounded-xl border- border-slate-200 shadow-md bg-white p-6'>
                    <div className='flex items-center justify-center gap-2'>
                        <User className='text-blue-500' size={22} />
                        <h3 className='text-lg font-medium text-slate-600'>
                            Profile Information
                        </h3>
                    </div>

                    <div className=' mt-2 space-y-4 '>
                        <div className='flex gap-3 '>
                            <p className='text-slate-700 font-medium '>
                                Full Name:-
                            </p>
                            <p className='text-blue-600'>
                                {user?.name}
                            </p>
                        </div>

                        <div className='flex gap-3 '>
                            <p className='text-slate-700 font-medium'>
                                Email Address:-
                            </p>
                            <p className='text-blue-600'>
                                {user?.email}
                            </p>

                        </div>


                    </div>
                </section>

                <section className='rounded-xl border border-slate-200 shadow-md p-6 bg-white'>
                    <div className='flex items-center justify-center gap-2 mb-3'>
                        <ShieldCheck className='text-blue-500' size={22}/>
                        <h3 className='ext-lg font-medium text-slate-600'>
                            Account Security
                        </h3>
                    </div>
                    <p className='mt-2 text-sm text-slate-500'>
                        Your account is protected by authentication.
                    </p>
                    <p className='mt-2 text-sm text-slate-500'>
                        Password changes are not available yet.
                    </p>
                </section>

                <section className='rounded-xl bg-white p-6 border border-red-100 shadow-md '>
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <h3 className='font-semibold text-slate-800'>
                                Logout
                            </h3>
                            <p className='mt-1 text-sm text-slate-500'>
                                Sign out from your admin account
                            </p>
                        </div>

                        <button className='group flex items-center justify-center gap-2 bg-red-100 p-2 rounded-xl transition-all hover:bg-red-200'
                        onClick={logout}>
                            <LogOut size={17} className='text-red-400 transition  group-hover:scale-x-110'/>
                            Logout

                        </button>
                    </div>
                </section>

            </div>
        </AdminLayout>
    )
}

export default SettingsPage;