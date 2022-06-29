import { Combobox, Dialog, Transition } from '@headlessui/react';
import { useState, Fragment } from 'react';
import useProyectos from "../hooks/useProyectos";
import { useNavigate, useParams } from 'react-router-dom';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Busqueda = () => {
    const [busqueda, setBusqueda] = useState('');
    const { buscador, handleBuscador, proyectos, obtenerProyecto } = useProyectos();
    const navigate = useNavigate();
    const params = useParams();    

    const proyectosFiltrados = busqueda === '' ? proyectos : proyectos.filter((proyecto) => {
        return proyecto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    });

    const handleSelection = async proyecto => {
        handleBuscador();
        if(params?.id) {
            await obtenerProyecto(proyecto._id);
            navigate(`/proyectos/${proyecto._id}`)

        } else {
            navigate(`/proyectos/${proyecto._id}`)
        }    
    }

    return (
        <>
            <Transition.Root appear show={buscador} as={Fragment} afterLeave={() => setBusqueda('')}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto p-4 pt-16 sm:p-20 md:p-20" onClose={handleBuscador}>
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
                                <Combobox
                                    as='div'
                                    className='mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all'
                                    onChange={(proyecto) => handleSelection(proyecto)}
                                >
                                    <div className='relative'>
                                        <Combobox.Input
                                            className='h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm'
                                            placeholder='Buscar...'
                                            onChange={e => setBusqueda(e.target.value)}
                                        />
                                    </div>


                                    {proyectosFiltrados.length > 0 && (
                                        <Combobox.Options static className='max-h-72 scroll-py-72 overflow-y-auto py-2 text-sm text-gray-800'>
                                            {proyectosFiltrados.map(proyecto => (
                                                <Combobox.Option
                                                    key={proyecto._id}
                                                    value={proyecto}
                                                    className={({ active }) => classNames('cursor-default select-none px-4 py-2', active && 'bg-sky-600 text-white')}
                                                >
                                                    {proyecto.nombre}
                                                </Combobox.Option>
                                            ))}
                                        </Combobox.Options>
                                    )}
                                </Combobox>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

export default Busqueda;