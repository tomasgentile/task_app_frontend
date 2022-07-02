import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProyectos from '../hooks/useProyectos';
import useAdmin from '../hooks/useAdmin';
import ModalFomularioTarea from '../components/ModalFomularioTarea';
import Tarea from '../components/Tarea';
import ModalEliminarTarea from '../components/ModalEliminarTarea';
import Alerta from '../components/Alerta';
import Colaborador from '../components/Colaborador';
import ModalEliminarColaborador from '../components/ModalEliminarColaborador';
import TemplateProyecto from '../components/TemplateProyecto';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';


let socket;

const Proyecto = () => {
  const params = useParams();
  const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, eliminarProyecto, submitTareasProyecto, eliminarTareaProyecto, editarTareaProyecto, completarTareaProyecto } = useProyectos();
  const admin = useAdmin();
  const { nombre } = proyecto;

  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  const handleClickEliminar = () => {
    if (confirm('¿Deseas Eliminar este Proyecto?')) {
      eliminarProyecto(params.id);
    }
  }

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit('abrir proyecto', params.id);
  });

  useEffect(() => {
    socket.on('tarea agregada', tareaNueva => {
      // Verifica que la tarea agregada pertenezca al proyecto abierto
      if (tareaNueva.proyecto === proyecto._id) {
        submitTareasProyecto(tareaNueva);
      }
    });
    socket.on('tarea eliminada', tareaEliminada => {
      if (tareaEliminada.proyecto === proyecto._id) {
        eliminarTareaProyecto(tareaEliminada);
        toast.info('Otro usuario elimino una terea');
      }
    });
    socket.on('tarea modificada', tareaModificada => {
      if (tareaModificada.proyecto._id === proyecto._id) {
        editarTareaProyecto(tareaModificada);
      }
    });
    socket.on('estado modificado', nuevoEstadoTarea => {
      if (nuevoEstadoTarea.proyecto._id === proyecto._id) {
        completarTareaProyecto(nuevoEstadoTarea);
        toast.info('Otro usuario modifico el estado de una terea');
      }
    })
  })

  const { msg } = alerta;

  return (
    <>
      <div className='lg:flex lg:justify-between'>
        {cargando ? (<div className="h-10 w-1/3 bg-slate-200 rounded col-span-2"></div>) :
          <h1 className='font-black text-4xl text-center'>{nombre}</h1>
        }

        {admin && (
          <div className='flex mt-4 justify-center'>
            <Link
              className='flex items-center gap-1 text-green-600 hover:text-green-900 uppercase font-bold mx-3'
              to={`/proyectos/editar/${params.id}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </Link>
            <button
              className='flex items-center gap-2 text-red-400 hover:text-red-600 uppercase font-bold'
              onClick={handleClickEliminar}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div className='flex justify-between'>
        <p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>
        {admin && (
          <button
            type='button'
            className='text-sm px-5 py-2 md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center hover:text-black'
            onClick={handleModalTarea}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Nueva Tarea</button>
        )}
      </div>


      {cargando ? <TemplateProyecto /> : (
        <>
          <div className='flex justify-center'>
            <div className='md:w-1/3 lg:w-1/4'>
              {msg && <Alerta alerta={alerta} />}
            </div>
          </div>
          <div className='bg-white shadow mt-10 rounded-lg'>
            {proyecto.tareas?.length ?
              proyecto.tareas.map(tarea => (
                <Tarea
                  key={tarea._id}
                  tarea={tarea}
                />
              )
              ) :
              <p className='text-center my-5 p-10'>No hay tareas en este Proyecto</p>}
          </div>
          {admin && (
            <>
              <div className='flex items-center justify-between mt-10'>
                <p className='font-bold text-xl'>Colaboradores</p>
                <Link
                  to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                  className='bg-gray-400 text-white px-5 py-2 rounded-lg text-sm uppercase font-bold hover:text-black flex items-center gap-1'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Añadir
                </Link>
              </div>
              <div className='bg-white shadow mt-10 rounded-lg'>
                {proyecto.colaboradores?.length ?
                  proyecto.colaboradores.map(colaborador => (
                    <Colaborador
                      key={colaborador._id}
                      colaborador={colaborador}
                    />
                  )
                  ) :
                  <p className='text-center my-5 p-10'>No hay colaboradores en este Proyecto</p>}
              </div>
            </>
          )}
        </>
      )}
      <ModalFomularioTarea />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
    </>
  )
}

export default Proyecto