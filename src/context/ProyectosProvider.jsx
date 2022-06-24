import { useState, useEffect, createContext } from 'react';
import clienteAxios from '../config/clienteAxios';
import { useNavigate } from 'react-router-dom';

const ProyectosContext = createContext();

const ProyectosPrvider = ({ children }) => {
    const [proyectos, setProyectos] = useState({});
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [ocultaForm, setOcultaForm] = useState(true);
    const [cargando, setCargando] = useState(false);
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [tarea, setTarea] = useState({});
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [colaborador, setColaborador] = useState({});
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const obtenerProyectos = async () => {
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
    }, []);

    const mostrarAlerta = (alerta) => {
        setAlerta(alerta);

        setTimeout(() => {
            setAlerta({})
        }, 3000);
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
            setOcultaForm(false);

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
            setOcultaForm(false);

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
        } catch (error) {
            console.log(error)
        }
        setCargando(false);
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
            setOcultaForm(false);

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
            let proyectoActualizado = { ...proyecto };
            proyectoActualizado.tareas = [...proyectoActualizado.tareas, data];

            setProyecto(proyectoActualizado);
            handleModalTarea();
            setAlerta({});

        } catch (error) {
            console.log(error);
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
            const proyectoActualizado = { ...proyecto };
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id !== data._id ? tareaState : data);
            setProyecto(proyectoActualizado);
            setModalFormularioTarea(false);
            setAlerta({});
        } catch (error) {
            console.log(error);
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
            const proyectoActualizado = { ...proyecto };
            proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id);
            setProyecto(proyectoActualizado);
            mostrarAlerta({
                msg: data.msg,
                error: false
            });
            setModalEliminarTarea(false);
            setTarea({});
        } catch (error) {
            console.log(error);
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
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config);

            const proyectoActualizado = {...proyecto};
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

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                alerta,
                mostrarAlerta,
                submitProyecto,
                ocultaForm,
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
                eliminarColaborador
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export { ProyectosPrvider };
export default ProyectosContext;
