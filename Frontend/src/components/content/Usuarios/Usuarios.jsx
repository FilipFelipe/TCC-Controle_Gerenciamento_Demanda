import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { GET_USERS } from '../../../api';
import { changeMainHeaderTitle } from '../../../store/ui';
import Card from '../../ui/misc/Card';
import Loading from '../../ui/misc/Loading';
import UsuarioModal from './UsuarioModal';

const Usuarios = () => {
  const [users, setUsers] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ show: false, user: null });

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.user.token);

  const showModal = (user) => {
    setModal({ show: true, user: user || null });
  };

  const closeModal = () => {
    setModal({ show: false, user: null });
  };

  useEffect(() => {
    dispatch(changeMainHeaderTitle('Usuários'));
  }, [dispatch]);

  const getUsers = useCallback(async () => {
    try {
      const { url, options } = GET_USERS(token, page);
      const response = await fetch(url, options);
      const json = await response.json();
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }
      setUsers(json);
      console.log(json);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, token]);

  useEffect(() => {
    getUsers();
  }, [getUsers, token]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <Card className="d-flex flex-column p-3" height="100%">
      <Button
        onClick={() => showModal()}
        className="align-self-end"
        variant="primary"
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <div className="d-flex flex-column align-items-center">
        <UsuarioModal
          modal={modal}
          closeModal={closeModal}
          getUsers={getUsers}
        />
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Administrador</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.data.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.nome}</td>
                  <td>{user.email}</td>
                  <td>{user.administrador ? 'Sim' : 'Não'}</td>
                  <td>{user.ativo ? 'Sim' : 'Não'}</td>
                  <td>
                    <Button
                      onClick={() => showModal(user)}
                      variant="warning"
                      size="sm"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Pagination>
          {[...Array(users.numeroDePaginas).keys()].map((number) => (
            <Pagination.Item
              onClick={() => setPage(number + 1)}
              key={number + 1}
              active={number + 1 === page}
            >
              {number + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </Card>
  );
};

export default Usuarios;
