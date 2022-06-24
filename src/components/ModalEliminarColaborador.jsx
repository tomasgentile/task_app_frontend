import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import useProyectos from '../hooks/useProyectos';

const ModalEliminarColaborador = () => {
    const { modalEliminarColaborador, handleModalEliminarColaborador, eliminarColaborador } = useProyectos();

    return (
        <>
            <Transition appear show={modalEliminarColaborador} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleModalEliminarColaborador}>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Eliminar Colaborador
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent  px-4 py-2 text-sm font-medium   focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2"
                                            onClick={handleModalEliminarColaborador}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 focus-visible:ring-blue-500 text-gray-500 hover:text-gray-800"
                                                viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dialog.Title>
                                    <div className='mt-2'>
                                        <p className='text-sm'>Una vez eliminado esta persona no podrá acceder al proyecto</p>
                                        <div className='flex justify-end gap-3 mt-4'>
                                            <button
                                                className='p-2 rounded border-solid text-white bg-red-600 w-20 hover:bg-red-700 transition-colors text-sm'
                                                onClick={eliminarColaborador}
                                            >Eliminar</button>
                                            <button
                                                className='p-2 rounded border-solid border-2 w-20 hover:bg-gray-300 transition-colors text-sm'
                                                onClick={handleModalEliminarColaborador}
                                            >Cancelar</button>
                                        </div>
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

export default ModalEliminarColaborador;
