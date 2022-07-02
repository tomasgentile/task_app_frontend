import useProyectos from '../hooks/useProyectos';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import FormularioProyecto from '../components/FormularioProyecto';
import Spinner from '../components/Spinner';

const EditarProyecto = () => {
    const { proyecto, obtenerProyecto, cargando } = useProyectos();
    const params = useParams();

    useEffect(() => {
        obtenerProyecto(params.id);
    }, []);

    const { nombre } = proyecto;

    if (cargando) return <Spinner/>;

    return (
        <>
            <h1 className='font-black text-4xl'>EditarProyecto: {nombre}</h1>
            <div className='mt-10 flex justify-center'>
                <FormularioProyecto />
            </div>
        </>
    )
}

export default EditarProyecto