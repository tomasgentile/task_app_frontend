import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import useProyectos from '../hooks/useProyectos';
import Alerta from './Alerta';
import { useParams } from 'react-router-dom';

const PRIORIDAD = ['Baja', 'Media', 'Alta'];

const ModalFomularioTarea = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [prioridad, setPrioridad] = useState('');
    const [fechaEntrega, setFechaEntrega] = useState('');

    const { modalFormularioTarea, handleModalTarea, mostrarAlerta, alerta, submitTarea, tarea } = useProyectos();
    const params = useParams();

    useEffect(() => {
        if (tarea._id) {
            setNombre(tarea.nombre);
            setDescripcion(tarea.descripcion);
            setPrioridad(tarea.prioridad);
            setFechaEntrega(tarea.fechaEntrega.split('T')[0]);
        } else {
            setNombre('');
            setDescripcion('');
            setPrioridad('');
            setFechaEntrega('');
        }
    }, [tarea]);

    const handleSubmit = async e => {
        e.preventDefault();

        if ([nombre, descripcion, prioridad, fechaEntrega].includes('')) {
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }
        await submitTarea({ nombre, descripcion, fechaEntrega, prioridad, proyecto: params.id, _id: tarea._id });
        setNombre('');
        setDescripcion('');
        setPrioridad('');
        setFechaEntrega('');
    }

    const { msg } = alerta;

    return (
        <>
            <Transition appear show={modalFormularioTarea} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleModalTarea}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
                                    >
                                        {tarea._id ? 'Editar Tarea' : 'Crear Tarea'}
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent  px-4 py-2 text-sm font-medium   focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2"
                                            onClick={handleModalTarea}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 focus-visible:ring-blue-500 text-gray-500 hover:text-gray-800"
                                                viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        {msg && <Alerta alerta={alerta} />}
                                        <form className='my-10' onSubmit={handleSubmit}>
                                            <div className='mb-5'>
                                                <label
                                                    className='text-gray-600 uppercase font-bold text-sm'
                                                    htmlFor='nombre'
                                                >
                                                    Nombre Tarea
                                                </label>
                                                <input
                                                    id='nombre'
                                                    type='text'
                                                    placeholder='Nombre de la Tarea'
                                                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                                                    value={nombre}
                                                    onChange={e => setNombre(e.target.value)}
                                                />
                                            </div>
                                            <div className='mb-5'>
                                                <label
                                                    className='text-gray-600 uppercase font-bold text-sm'
                                                    htmlFor='descripcion'
                                                >
                                                    Descripción
                                                </label>
                                                <textarea
                                                    id='descripcion'
                                                    placeholder='Descripción de la Tarea'
                                                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                                                    value={descripcion}
                                                    onChange={e => setDescripcion(e.target.value)}
                                                />
                                            </div>
                                            <div className='mb-5'>
                                                <label
                                                    className='text-gray-600 uppercase font-bold text-sm'
                                                    htmlFor='fecha-entrega'
                                                >
                                                    Fecha de Entrega
                                                </label>
                                                <input
                                                    id='fecha-entrega'
                                                    type='date'
                                                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                                                    value={fechaEntrega}
                                                    onChange={e => setFechaEntrega(e.target.value)}
                                                />
                                            </div>
                                            <div className='mb-5'>
                                                <label
                                                    className='text-gray-600 uppercase font-bold text-sm'
                                                    htmlFor='prioridad'
                                                >
                                                    Prioridad
                                                </label>
                                                <select
                                                    id='prioridad'
                                                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                                                    value={prioridad}
                                                    onChange={e => setPrioridad(e.target.value)}
                                                >
                                                    <option value=''>-- Sleccionar --</option>
                                                    {PRIORIDAD.map(opcion => (
                                                        <option key={opcion}>{opcion}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <input
                                                type='submit'
                                                value={tarea._id ? 'Guardar Cambios' : 'Crear Tarea'}
                                                className='bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm'
                                            />
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default ModalFomularioTarea;