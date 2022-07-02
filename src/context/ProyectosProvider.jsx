import { useState, useEffect, createContext } from 'react';
import clienteAxios from '../config/clienteAxios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';

let socket;

const ProyectosContext = createContext();

const ProyectosPrvider = ({ children }) => {
    const [proyectos, setProyectos] = useState({});
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [ocultaForm, setOcultaForm] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [tarea, setTarea] = useState({});
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [colaborador, setColaborador] = useState({});
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);
    const [buscador, setBuscador] = useState(false);

    const navigate = useNavigate();
    const { auth } = useAuth();

    useEffect(() => {
        const obtenerProyectos = async () => {
            setCargando(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) return

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios('/proyectos', config);
                setProyectos(data);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerProyectos();
        setCargando(false);
    }, [auth]);

    useEffect(() => {
        //Abre conexión con socket.io
        socket = io(import.meta.env.VITE_BACKEND_URL);
    }, [])

    const mostrarAlerta = (alerta) => {
        setAlerta(alerta);

        setTimeout(() => {
            setAlerta({})
        }, 2500);
    }

    const submitProyecto = async (proyecto) => {
        if (proyecto.id) {
            await editarProyecto(proyecto);
        } else {
            await nuevoProyecto(proyecto)
        }
    }

    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config);
            const proyectosActualizado = proyectos.filter(proyectoState => proyectoState._id !== data._id);
            setProyectos([...proyectosActualizado, data]);
            mostrarAlerta({
                msg: 'Proyecto Modificado Correctamente',
                error: false
            });
            setOcultaForm(true);

            setTimeout(() => {
                navigate('/proyectos');
            }, 2500)

        } catch (error) {
            console.log(error)
        }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos', proyecto, config);
            setProyectos([...proyectos, data]);
            mostrarAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            });
            setOcultaForm(true);

            setTimeout(() => {
                navigate('/proyectos');
            }, 2500)

        } catch (error) {
            console.log(error)
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios(`/proyectos/${id}`, config);
            setProyecto(data);
            setAlerta({});
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            });
        } finally {
            setCargando(false);
        }
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);
            const proyectosActualizado = proyectos.filter(proyectoState => proyectoState._id !== id);
            setProyectos(proyectosActualizado);
            mostrarAlerta({
                msg: data.msg,
                error: false
            });
            setOcultaForm(true);

            setTimeout(() => {
                navigate('/proyectos');
            }, 2500)
        } catch (error) {
            console.log(error);
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea);
        setTarea({});
    }

    const submitTarea = async tarea => {
        if (tarea._id) {
            await editarTarea(tarea);
        } else {
            await crearTarea(tarea);
        }
    }

    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/tareas', tarea, config);

            handleModalTarea();
            setAlerta({});

            // Socket.io
            socket.emit('nueva tarea', data);
        } catch (error) {
            handleModalTarea();
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            });
        }
    }

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea._id}`, tarea, config);

            setModalFormularioTarea(false);
            setAlerta({});

            // Socket io
            socket.emit('editar tarea', data);
        } catch (error) {
            handleModalTarea();
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            });
        }
    }

    const handleModalEditarTarea = tarea => {
        setTarea(tarea);
        setModalFormularioTarea(true);
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea);
        setModalEliminarTarea(!modalEliminarTarea);
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config);

            mostrarAlerta({
                msg: data.msg,
                error: false
            });
            setModalEliminarTarea(false);

            // Socket io
            socket.emit('eliminar tarea', tarea);

            setTarea({});
        } catch (error) {
            setModalEliminarTarea(false);
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            });
            setTarea({});
        }
    }

    const submitColaborador = async email => {
        setCargando(true);
        setColaborador({});
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos/colaboradores', { email }, config);
            setColaborador(data);
        } catch (error) {
            console.log(error)
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            });
        } finally {
            setCargando(false);
        }
    }

    const agregarColaborador = async email => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config);
            mostrarAlerta({
                msg: data.msg,
                error: false
            });
            setColaborador({});
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleModalEliminarColaborador = colaborador => {
        setColaborador(colaborador);
        setModalEliminarColaborador(!modalEliminarColaborador);
    }

    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config);

            const proyectoActualizado = { ...proyecto };
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id);
            setProyecto(proyectoActualizado);
            setModalEliminarColaborador(false);
            setColaborador({});
            mostrarAlerta({
                msg: data.msg,
                error: false
            });
        } catch (error) {
            console.log(error)
        }
    }

    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config);
            setTarea({});
            setAlerta({});

            // Socket io
            socket.emit('cambiar estado', data);
        } catch (error) {
            console.log(error.response)
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador);
    }

    // Socket io
    const submitTareasProyecto = tarea => {
        // Agregar Tarea al State
        let proyectoActualizado = { ...proyecto };
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];
        setProyecto(proyectoActualizado);
    }

    const eliminarTareaProyecto = tarea => {
        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id);
        setProyecto(proyectoActualizado);
    }

    const editarTareaProyecto = tarea => {
        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id !== tarea._id ? tareaState : tarea);
        setProyecto(proyectoActualizado);
    }

    const completarTareaProyecto = tarea => {
        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id !== tarea._id ? tareaState : tarea);
        setProyecto(proyectoActualizado);
    }

    const cerrarSesionProyecto = () => {
        setProyectos([]);
        setProyecto({});
        setAlerta({});
    }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                alerta,
                mostrarAlerta,
                submitProyecto,
                ocultaForm,
                setOcultaForm,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                modalEliminarColaborador,
                handleModalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                editarTareaProyecto,
                completarTareaProyecto,
                cerrarSesionProyecto
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export { ProyectosPrvider };
export default ProyectosContext;
