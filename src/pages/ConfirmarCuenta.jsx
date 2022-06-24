import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import clienteAxios from '../config/clienteAxios';
import Alerta from '../components/Alerta';

const ConfirmarCuenta = () => {
  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`;
        console.log(url);
        const { data } = await clienteAxios(url);
        console.log(data)

        setAlerta({
          msg: data.msg,
          error: false
        });
        setCuentaConfirmada(true);

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        });
      }
    }
    // Cleanup para que el useEfeect se ejecute solo una vez
    return () => { confirmarCuenta() }
  }, []);

  const { msg } = alerta;

  return (
    <>
      <h1 className='text-sky-600 font-black text-5xl capitalize'>Confirma tu cuenta y comienza a crear tus <span className='text-slate-700'>proyectos</span></h1>
      <div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>
        {msg && <Alerta alerta={alerta} />}
        {cuentaConfirmada && (
          <Link
            className='block text-center my-5 text-slate-500 uppercase text-sm'
            to='/'
          >Inicia Sesión</Link>
        )}
      </div>

    </>
  )
}

export default ConfirmarCuenta