import React, { useEffect, useState } from 'react';
import { Col, Form, Modal, Row, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CREATE_USER, UPDATE_USER } from '../../../api';

const initialState = {
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
};

function UsuarioModal({ modal, closeModal, getUsers }) {
  const [user, setUser] = useState(initialState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    setError(null);
    if (modal.user) {
      setUser({ ...modal.user, senha: '', confirmarSenha: '' });
    } else {
      setUser(initialState);
    }
  }, [modal]);

  const handleChange = (target) => {
    const { name, value } = target;

    setUser({ ...user, [name]: value });
  };

  const handleChangeCheckbox = (target) => {
    const { name, checked } = target;
    setUser({ ...user, [name]: checked });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user.id) {
      try {
        setLoading(true);
        if (user.senha !== user.confirmarSenha) {
          return setError('Senhas não conferem.');
        }
        const { url, options } = CREATE_USER(token, user);
        const response = await fetch(url, options);
        if (!response.ok) {
          const json = await response.json();
          throw new Error(json.msg);
        }
        closeModal();
        getUsers();
        toast.success('Cadastrado com sucesso!');
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        if (user.senha !== user.confirmarSenha) {
          return setError('Senhas não conferem.');
        }
        const { url, options } = UPDATE_USER(token, user.id, user);
        const response = await fetch(url, options);
        if (!response.ok) {
          const json = await response.json();
          throw new Error(json.msg);
        }
        closeModal();
        getUsers();
        toast.success('Alterado com sucesso!');
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal show={modal.show} onHide={closeModal}>
      <Modal.Header>
        {modal.user ? 'Editar usuário' : 'Criar usuário'}
      </Modal.Header>
      <Modal.Body className="m-1">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              value={user.nome}
              onChange={({ target }) => handleChange(target)}
              type="text"
              name="nome"
              placeholder="Informe o nome do usuário"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              value={user.email}
              onChange={({ target }) => handleChange(target)}
              type="email"
              name="email"
              placeholder="Informe o e-mail do usuário"
            />
          </Form.Group>
          {modal.user && (
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Administrador</Form.Label>
                <Form.Check
                  checked={user.administrador}
                  onChange={({ target }) => handleChangeCheckbox(target)}
                  type="checkbox"
                  name="administrador"
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Ativo</Form.Label>
                <Form.Check
                  checked={user.ativo}
                  onChange={({ target }) => handleChangeCheckbox(target)}
                  type="checkbox"
                  name="ativo"
                />
              </Form.Group>
            </Row>
          )}
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Senha</Form.Label>
              <Form.Control
                checked={user.administrador}
                onChange={({ target }) => handleChange(target)}
                type="password"
                name="senha"
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Confirmar Senha</Form.Label>
              <Form.Control
                checked={user.ativo}
                onChange={({ target }) => handleChange(target)}
                type="password"
                name="confirmarSenha"
              />
            </Form.Group>
          </Row>
          {error && <p className="text-danger">{error}</p>}
          <Modal.Footer className="p-0 pt-2">
            <Button type="submit">
              {loading ? (
                <div
                  className="spinner-border spinner-border-sm"
                  role="status"
                />
              ) : (
                'Salvar'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UsuarioModal;
