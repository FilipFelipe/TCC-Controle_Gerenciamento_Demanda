import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Pagination, Table, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CREATE_LOCAL, GET_LOCALS } from '../../../api';
import useForm from '../../../hooks/useForm';
import { changeMainHeaderTitle } from '../../../store/ui';
import Card from '../../ui/misc/Card';
import Loading from '../../ui/misc/Loading';
import style from './Local.module.css';

function Local() {
  const [locais, setLocais] = useState();
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState(1);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const localName = useForm();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.user.token);

  useEffect(() => {
    dispatch(changeMainHeaderTitle('Locais'));
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!localName.validate()) {
      setFormError(localName.error);
    }

    try {
      setFormLoading(true);
      const { url, options } = CREATE_LOCAL(token, { nome: localName.value });
      const response = await fetch(url, options);
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.msg);
      }
      setModal(false);
      localName.setValue('');
      toast.success('Local criado com sucesso!');
      getLocals();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const getLocals = useCallback(async () => {
    try {
      const { url, options } = GET_LOCALS(token, page);
      const response = await fetch(url, options);
      const json = await response.json();
      if (!response.ok) {
        throw new Error('Erro ao buscar equipamentos.');
      }
      setLocais(json);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, token]);

  useEffect(() => {
    getLocals();
  }, [getLocals]);

  return (
    <Card
      className={`d-flex pt-5 flex-column align-items-center p-4 ${style.local}`}
      height="100%"
      width="100%"
    >
      <Button
        onClick={() => setModal(true)}
        className="align-self-end"
        variant="primary"
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <Modal show={modal} onHide={() => setModal(false)}>
        <Modal.Header>Cadastrar novo local</Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                required
                value={localName.value}
                onChange={({ target }) => localName.setValue(target.value)}
                type="text"
                name="nome"
                placeholder="Informe o nome do local"
              />
            </Form.Group>
            {formError && <p style={{ color: 'red' }}>{formError}</p>}
            <Modal.Footer>
              <Button type="submit">
                {formLoading ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  />
                ) : (
                  'Concluir'
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      {loading ? (
        <Loading />
      ) : error ? (
        <h1>{error}</h1>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
              </tr>
            </thead>
            <tbody>
              {locais.data.map((local) => (
                <tr key={local.id}>
                  <td>{local.id}</td>
                  <td>{local.nome}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {[...Array(locais.numeroDePaginas).keys()].map((number) => (
              <Pagination.Item
                onClick={() => setPage(number + 1)}
                key={number + 1}
                active={number + 1 === page}
              >
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </Card>
  );
}

export default Local;
