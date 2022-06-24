import useProyectos from '../hooks/useProyectos';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import FormularioProyecto from '../components/FormularioProyecto';

const EditarProyecto = () => {
    const { proyecto, obtenerProyecto, cargando, eliminarProyecto } = useProyectos();
    const params = useParams();

    useEffect(() => {
        obtenerProyecto(params.id);
    }, []);

    const { nombre } = proyecto;

    const handleClick = () => {
        if(confirm('¿Deseas Eliminar este Proyecto?')) {
            eliminarProyecto(params.id);
        }
    }

    if (cargando) return 'Cargando...';

    return (
        <>
            <div className='flex justify-between'>
                <h1 className='font-black text-4xl'>EditarProyecto: {nombre}</h1>
                <button
                    className='flex items-center gap-2 text-red-400 hover:text-red-600 uppercase font-bold'
                    onClick={handleClick}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                </button>
            </div>
            <div className='mt-10 flex justify-center'>
                <FormularioProyecto />
            </div>
        </>

    )
}

export default EditarProyecto