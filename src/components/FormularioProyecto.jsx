import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useProyectos from '../hooks/useProyectos';
import Alerta from './Alerta';

const FormularioProyecto = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [cliente, setCliente] = useState('');
    const [id, setId] = useState(null);

    const { mostrarAlerta, alerta, submitProyecto, ocultaForm, proyecto } = useProyectos();
    const params = useParams();
    
    useEffect(() => {
        setId(params.id);
        // Se estamos Editando, pone los datos del proyecto en el state
        if (params.id) {
            setNombre(proyecto.nombre);
            setDescripcion(proyecto.descripcion);
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0]);
            setCliente(proyecto.cliente);
        }
    }, [params]);

    const handleSubmit = async e => {
        e.preventDefault();

        if ([nombre, descripcion, fechaEntrega, cliente].includes('')) {
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }
        // Envia los datos al Provider
        await submitProyecto({ nombre, descripcion, fechaEntrega, cliente, id });

        // Resetea el fomulario
        setNombre('');
        setDescripcion('');
        setFechaEntrega('');
        setCliente('');
        setId(null);
    }

    const { msg } = alerta;

    return (
        <form
            className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
            onSubmit={handleSubmit}
        >
            {msg && <Alerta alerta={alerta} />}
            {ocultaForm && (
                <>
                    <div className='mb-5'>
                        <label
                            htmlFor='nombre'
                            className='text-gray-700 uppercase font-bold text-sm '
                        >Nombre Proyecto</label>
                        <input
                            type='text'
                            id='nombre'
                            className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                            placeholder='Nombre del Proyecto'
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            autoFocus={true}
                        />
                    </div>
                    <div className='mb-5'>
                        <label
                            htmlFor='descripcion'
                            className='text-gray-700 uppercase font-bold text-sm '
                        >Descripción</label>
                        <textarea
                            id='descripcion'
                            className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                            placeholder='Descripción del Proyecto'
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                        />
                    </div>
                    <div className='mb-5'>
                        <label
                            htmlFor='fecha-entrega'
                            className='text-gray-700 uppercase font-bold text-sm '
                        >Fecha de entrega</label>
                        <input
                            type='date'
                            id='fecha-entrega'
                            className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                            value={fechaEntrega}
                            onChange={e => setFechaEntrega(e.target.value)}
                        />
                    </div>
                    <div className='mb-5'>
                        <label
                            htmlFor='cliente'
                            className='text-gray-700 uppercase font-bold text-sm '
                        >Nombre Cliente</label>
                        <input
                            type='text'
                            id='cliente'
                            className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                            placeholder='Nombre del Cliente'
                            value={cliente}
                            onChange={e => setCliente(e.target.value)}
                        />
                    </div>
                    <input
                        type='submit'
                        value={params.id ? 'Modificar Proyecto' : 'Crear Proyecto'}
                        className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors'
                    />
                </>
            )}

        </form>
    )
}

export default FormularioProyecto