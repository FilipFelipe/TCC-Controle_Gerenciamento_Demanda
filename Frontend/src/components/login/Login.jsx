import { faAt, faLock, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import style from './Login.module.css';
import Card from '../ui/misc/Card';
import { USER_LOGIN } from '../../api';
import useFetch from '../../hooks/useFetch';
import useForm from '../../hooks/useForm';
import Loading from '../ui/misc/Loading';
import Input from '../ui/forms/Input';
import { login } from '../../store/user';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

const Login = () => {
  const email = useForm('email');
  const password = useForm();
  const { loading, error, request } = useFetch();

  const dispatch = useDispatch();
  const navigation = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (email.validate() && password.validate()) {
      const { url, options } = USER_LOGIN({
        email: email.value,
        senha: password.value,
      });
      const { response, json } = await request(url, options);
      if (response?.ok) {
        window.localStorage.setItem('user', JSON.stringify(json));
        dispatch(login(json));
        navigation('/');
      }
    }
  }

  return (
    <section className={style.login}>
      <Card width="500px" height="500px" className={style.loginBox}>
        <div className={style.loginBoxHeader}>
          <FontAwesomeIcon icon={faUsers} />
          <span>Login</span>
        </div>
        <form onSubmit={handleSubmit} className={style.loginForm}>
          <Input
            {...email}
            name="email"
            type="text"
            placeholder="E-mail"
            label={<FontAwesomeIcon icon={faAt} />}
          />
          <Input
            {...password}
            label={<FontAwesomeIcon icon={faLock} />}
            name="password"
            type="password"
            placeholder="Senha"
          />
          <button className={style.btnLogin}>
            {loading ? <Loading /> : 'Login'}
          </button>
          {error && (
            <p style={{ color: 'red', fontWeight: 'bold', fontSize: '1.1rem' }}>
              {error}
            </p>
          )}
        </form>
      </Card>
    </section>
  );
};

export default Login;
