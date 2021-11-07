import React, { useEffect, useState } from 'react';
import { Col, Form, Modal, Row, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CREATE_EQUIPAMENTOS, UPDATE_EQUIPAMENTOS } from '../../../api';

const initialState = {
  ativo: '',
  entrada: '',
  nome: '',
  numero_fases: '',
  prioridade: '',
  tensao_equipamento: '',
  tensao_fase: '',
};

function UsuarioModal({ modal, closeModal, getEquipamentos }) {
  const [equipamento, setEquipamento] = useState(initialState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.user.user.token);

  useEffect(() => {
    console.log(modal.equipamento);
    setError(null);
    if (modal.equipamento) {
      setEquipamento({ ...modal.equipamento });
    } else {
      setEquipamento(initialState);
    }
  }, [modal]);

  const handleChange = (target) => {
    const { name, value } = target;
    setEquipamento({ ...equipamento, [name]: value });
  };

  const handleChangeCheckbox = (target) => {
    const { name, checked } = target;
    setEquipamento({ ...equipamento, [name]: checked });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!equipamento.id) {
      try {
        setLoading(true);
        const { url, options } = CREATE_EQUIPAMENTOS(token, equipamento);
        const response = await fetch(url, options);
        if (!response.ok) {
          const json = await response.json();
          throw new Error(json.msg);
        }
        closeModal();
        getEquipamentos();
        toast.success('Cadastrado com sucesso!');
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const { url, options } = UPDATE_EQUIPAMENTOS(token, equipamento.id, equipamento);
        console.log(options);
        const response = await fetch(url, options);
        if (!response.ok) {
          const json = await response.json();
          throw new Error(json.msg);
        }
        closeModal();
        getEquipamentos();
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
        {modal.equipamento ? 'Editar Equipamento' : 'Criar Equipamento'}
      </Modal.Header>
      <Modal.Body className="m-1">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              value={equipamento.nome}
              onChange={({ target }) => handleChange(target)}
              type="text"
              name="nome"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Prioridade</Form.Label>
            <Form.Control
              value={equipamento.prioridade}
              min="1"
              onChange={({ target }) => handleChange(target)}
              type="number"
              name="prioridade"
      
            />
          </Form.Group>
          
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Ativo</Form.Label>
                <Form.Check
                  checked={equipamento.ativo}
                  onChange={({ target }) => handleChangeCheckbox(target)}
                  type="checkbox"
                  name="ativo"
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Ramal</Form.Label>
                <Form.Check
                  checked={equipamento.entrada}
                  onChange={({ target }) => handleChangeCheckbox(target)}
                  type="checkbox"
                  name="entrada"
                />
              </Form.Group>
            </Row>
          
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Tensão do equipamento</Form.Label>
              <Form.Control
                value={equipamento.tensao_equipamento}
                onChange={({ target }) => handleChange(target)}
                min="1"
                type="number"
                name="tensao_equipamento"
          
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Número de fases</Form.Label>
              <Form.Control
                value={equipamento.numero_fases}
                onChange={({ target }) => handleChange(target)}
                min="1"
                max="3"
                type="number"
                name="numero_fases"
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
