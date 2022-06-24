import useProyectos from "../hooks/useProyectos";

const Colaborador = ({ colaborador }) => {
    const { handleModalEliminarColaborador } = useProyectos();

    return (
        <div className='border-b p-5 flex justify-between items-center'>
            <div>
                <p>{colaborador.nombre}</p>
                <p className='text-sm text-gray-700'>{colaborador.email}</p>
            </div>
            <div>
                <button
                    type='button'
                    className='bg-red-600 px-4 py-3 font-bold text-sm rounded text-white uppercase'
                    onClick={() => handleModalEliminarColaborador(colaborador)}
                >Eliminar</button>
            </div>

        </div>
    )
}

export default Colaborador