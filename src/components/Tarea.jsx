import { formatearFecha } from "../helpers/formatearFecha";
import useProyectos from '../hooks/useProyectos';

const Tarea = ({ tarea }) => {
    const { nombre, descripcion, prioridad, fechaEntrega, _id, estado } = tarea;
    const { handleModalEditarTarea, handleModalEliminarTarea } = useProyectos();

    return (
        <div className='border-b p-5 flex justify-between items-center'>
            <div>
                <p className='text-xl mb-1'>{nombre}</p>
                <p className='text-gray-600 mb-1'>{descripcion}</p>
                <p className='text-gray-600 mb-1'>Fecha de entrega: {formatearFecha(fechaEntrega)}</p>
                <p className='text-gray-600 mb-1'>Prioridad: {prioridad}</p>
            </div>
            <div className='flex gap-2'>
                <button
                    className='bg-indigo-600 px-4 py-3 font-bold text-sm rounded text-white uppercase'
                    onClick={() => handleModalEditarTarea(tarea)}
                >Editar</button>

                {estado ? (
                    <button
                        className='bg-sky-600 px-4 py-3 font-bold text-sm rounded text-white uppercase'
                    >Completa</button>
                ) : (
                    <button
                        className='bg-sky-600 px-4 py-3 font-bold text-sm rounded text-white uppercase'
                    >Incompleta</button>
                )}

                <button
                    className='bg-red-600 px-4 py-3 font-bold text-sm rounded text-white uppercase'
                    onClick={() => handleModalEliminarTarea(tarea)}
                >Eliminar</button>
            </div>
        </div>
    )
}

export default Tarea