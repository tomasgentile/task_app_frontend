import { formatearFecha } from "../helpers/formatearFecha";
import useProyectos from '../hooks/useProyectos';
import useAdmin from "../hooks/useAdmin";

const Tarea = ({ tarea }) => {
    const { nombre, descripcion, prioridad, fechaEntrega, _id, estado, completado } = tarea;
    const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyectos();
    const admin = useAdmin();

    return (
        <div className='border-b p-5 flex justify-between items-center'>
            <div className='flex flex-col items-start'>
                <p className='text-xl mb-1'>{nombre}</p>
                <p className='text-gray-600 mb-1'>{descripcion}</p>
                <p className='text-gray-600 mb-1'>Fecha de entrega: {formatearFecha(fechaEntrega)}</p>
                <p className='text-gray-600 mb-1'>Prioridad: {prioridad}</p>
                {estado && <p className='text-xs bg-green-600 uppercase p-1 rounded-lg text-white'>Completador por: {completado.nombre}</p>}
            </div>
            <div className='flex flex-col lg:flex-row gap-2'>
                <button
                    className={`${estado ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 font-bold text-sm rounded text-white uppercase`}
                    onClick={() => completarTarea(_id)}
                >{estado ? 'Completa' : 'Incompleta'}</button>
                {admin && (
                    <button
                        className='bg-indigo-600 px-4 py-3 font-bold text-sm rounded text-white uppercase'
                        onClick={() => handleModalEditarTarea(tarea)}
                    >Editar</button>
                )}
                {admin && (
                    <button
                        className='bg-red-600 px-4 py-3 font-bold text-sm rounded text-white uppercase'
                        onClick={() => handleModalEliminarTarea(tarea)}
                    >Eliminar</button>
                )}

            </div>
        </div>
    )
}

export default Tarea