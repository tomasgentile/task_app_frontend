import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import clienteAxios from '../config/clienteAxios';
import Alerta from '../components/Alerta';

const NuevoPassword = () => {
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const [passwordModificado, setPasswordModificado] = useState(false);
  const [alerta, setAlerta] = useState({});
  const params = useParams();
  const token = params.token;

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`);
        setTokenValido(true);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }

    comprobarToken();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    if (password !== repetirPassword) {
      setAlerta({
        msg: 'Los password ingresados no son iguales',
        error: true
      })
      return
    }

    if (password.length < 6) {
      setAlerta({
        msg: 'El Password debe tener al menos 6 caracteres',
        error: true
      })
      return
    }

    // Enviar nuevo Password a la API
    try {
      const url = `/usuarios/olvide-password/${token}`
      const { data } = await clienteAxios.post(url, { password });
      setAlerta({
        msg: data.msg,
        error: false
      })
      setPasswordModificado(true);
    } catch (error) {
      setAlerta({
        msg: error.reponse.data.msg,
        error: true
      })
    }

  }

  const { msg } = alerta;

  return (
    <>
      <h1 className='text-sky-600 font-black text-5xl capitalize'>Reestablece tu password y no pierdas acceso a tus <span className='text-slate-700'>proyectos</span></h1>

      {msg && <Alerta alerta={alerta} />}

      {tokenValido && (
        <form
          className='my-10 bg-white shadow rounded-lg px-10 py-10'
          onSubmit={handleSubmit}
        >
          <div className='my-5'>
            <label
              className='uppercase text-gray-600 block text-xl font-bold'
              htmlFor='password'
            >Nuevo Password</label>
            <input
              id='password'
              type='password'
              placeholder='Escribe tu nuevo Password'
              className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className='my-5'>
            <label
              className='uppercase text-gray-600 block text-xl font-bold'
              htmlFor='password2'
            >Confirmar Password</label>
            <input
              id='password2'
              type='password'
              placeholder='Repetir tu Password'
              className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
              value={repetirPassword}
              onChange={e => setRepetirPassword(e.target.value)}
            />
          </div>
          <input
            type='submit'
            value='Guardar Nuevo Password'
            className='bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'
          />
        </form>
      )}

      {passwordModificado && (
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to='/'
        >Inicia Sesión</Link>
      )}
    </>
  )
}

export default NuevoPassword