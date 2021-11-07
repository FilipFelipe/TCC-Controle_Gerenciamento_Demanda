import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { GET_EQUIPAMENTOS } from '../../../api';
import { changeMainHeaderTitle } from '../../../store/ui';
import Card from '../../ui/misc/Card';
import Loading from '../../ui/misc/Loading';
import UsuarioModal from './EquipamentoModal';
import { toast } from 'react-toastify';

const AdminLinks = ({ children }) => {
  const admin = useSelector((state) => state.user.user.administrador);

  if (admin) {
    return <>{children}</>;
  }

  return <></>;
};
const Dispositivos = () => {
  const [equipamentos, setEquipamentos] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ show: false, equipamento: null });

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.user.token);

  const showModal = (equipamento) => {
    setModal({ show: true, equipamento: equipamento || null });
  };

  const closeModal = () => {
    setModal({ show: false, equipamento: null });
  };

  useEffect(() => {
    dispatch(changeMainHeaderTitle('Equipamentos'));
  }, [dispatch]);

  const getEquipamentos = useCallback(async () => {
    try {
      const { url, options } = GET_EQUIPAMENTOS(token, page);
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Erro ao buscar equipamentos');
      }
      const json = await response.json();
      setEquipamentos(json);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, token]);

  useEffect(() => {
    getEquipamentos();
  }, [getEquipamentos, token]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <h1>Error</h1>;
  }

  return (
    <Card className="d-flex flex-column p-3" height="100%">
      <AdminLinks>
      <Button
        onClick={() => showModal()}
        className="align-self-end"
        variant="primary"
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      </AdminLinks>
      <div className="d-flex flex-column align-items-center">
        <UsuarioModal
          modal={modal}
          closeModal={closeModal}
          getEquipamentos={getEquipamentos}
        />
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Equipamento</th>
              <th>Tensão do Equipamento</th>
              <th>Número de fase</th>
              <th>Ativo</th>
              <th>Ramal</th>
              <th>prioridade</th>
              <AdminLinks><th>Ações</th></AdminLinks>
              
            </tr>
          </thead>
          <tbody>
            {equipamentos.data.map((equipamento) => {
              return (
                <tr key={equipamento.id}>
                  <td>{equipamento.id}</td>
                  <td>{equipamento.nome}</td>
                  <td>{equipamento.tensao_equipamento} V</td>
                  <td>{equipamento.numero_fases}</td>
                  <td>{equipamento.ativo ? 'Sim' : 'Não'}</td>
                  <td>{equipamento.entrada ? 'Sim' : 'Não'}</td>
                  <td>{equipamento.prioridade}</td>
                  <AdminLinks>
                  <td>
                    <Button
                      onClick={() => showModal(equipamento)}
                      variant="warning"
                      size="sm"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                  </td>
                  </AdminLinks>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Pagination>
          {[...Array(equipamentos.numeroDePaginas).keys()].map((number) => (
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

export default Dispositivos;
