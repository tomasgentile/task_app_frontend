import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RutaProtegida = () => {
    const { auth, cargando } = useAuth();

    if (cargando) return 'Cargando...';

    return (
        <>
            {auth._id ? (
                <>
                    <div className='bg-gray-100'>
                        <Header />
                        <div className='md:flex md:min-h-screen'>
                            <Sidebar />
                            <main className='flex-1 p-10'>
                                <Outlet />
                            </main>
                        </div>
                    </div>
                    <ToastContainer />
                </>

            ) : <Navigate to='/' />}
        </>
    )
}

export default RutaProtegida