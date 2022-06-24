import FormularioColaborador from "../components/FormularioColaborador";
import { useEffect } from "react";
import useProyectos from "../hooks/useProyectos";
import { useParams } from "react-router-dom";

const NuevoColaborador = () => {
  const { obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador, alerta } = useProyectos();
  const params = useParams();

  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  return (
    <>
      <h1 className='text-4xl font-black'>Añadir Colaborador/a </h1>
      <h3 className='font-black mt-2 text-xl'>Proyecto: {proyecto.nombre}</h3>
      <div className='mt-10 flex justify-center'>
        <FormularioColaborador />
      </div>
      {cargando ? <p className='text-center mt-2'>Cargando...</p> : colaborador?._id && (
        <div className='flex justify-center mt-10'>
          <div className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'>
            <h2 className='text-center mb-10 text-2xl font-bold'>Nombre de usuario encontrado:</h2>
            
            <div className='flex justify-between items-center'>
              <p>{colaborador.nombre}</p>
              <button
                type='submit'
                onClick={() => agregarColaborador({ email: colaborador.email })}
                className='bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm'
              >
                Agregar al Proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NuevoColaborador