import style from './Configuracao.module.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { CONTROLE_ALL, CONTROLE_SAVE } from '../../../api';
import { toast } from 'react-toastify';
import { changeMainHeaderTitle } from '../../../store/ui';

const initialState = {
  senha: '',
  email: '',
  controlar_demanda: '',
  demanda_fora_ponta: '',
  demanda_ponta: '',
  horario_ponta: '',
  limiar_atuacao: '',
  tolerancia: '',
};

const Configuracao = (props) => {
  const [configuracoes, setConfiguracoes] = useState(initialState);
  const [confLoading, setConfLoading] = useState(false);
  const token = useSelector((state) => state.user.user.token);
  const email = useSelector((state) => state.user.user.email);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeMainHeaderTitle('Configuração'));
  }, [dispatch]);

  useEffect(() => {
    const buscarConfig = async () => {
      try {
        setConfLoading(true);
        const { url, options } = CONTROLE_ALL(token);
        const resposta = await fetch(url, options);
        const json = await resposta.json();
        if (!resposta.ok) {
          throw new Error('Erro ao buscar dispositivos.');
        }
        setConfiguracoes({ ...json, email });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setConfLoading(false);
      }
    };
    buscarConfig();
  }, [email, token]);

  const handleSubmit = (event) => {
    event.preventDefault();
    let dados = configuracoes;
    if (dados.controlar_demanda === 'Ativo' || dados.controlar_demanda === 1) {
      dados.controlar_demanda = 1;
    } else {
      dados.controlar_demanda = 0;
    }
    const salvarDados = async () => {
      try {
        setConfLoading(true);
        const { url, options } = CONTROLE_SAVE(token, dados);
        const resposta = await fetch(url, options);
        if (!resposta.ok) {
          const json = await resposta.json();
          throw new Error('Erro: ' + json.msg);
        }
        toast.success('Dados salvo com sucesso!');
      } catch (error) {
        toast.error(error.message);
      } finally {
        setConfLoading(false);
      }
    };
    salvarDados();
  };

  const handleChange = ({ target }) => {
    const campo = {};
    campo[target.name] = target.value;
    setConfiguracoes({ ...configuracoes, ...campo });
  };
  return (
    <div className={style.main}>
      <div className={style.configuracao_frame}>
        <div className={style.configuracao_form}>
          {confLoading ? (
            <div className={style.carregando}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="email">
                  <Form.Label>E-mail</Form.Label>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">E-mail Atual</Tooltip>
                    }
                  >
                    <span>
                      <Form.Control
                        disabled
                        type="email"
                        style={{ pointerEvents: 'none' }}
                        value={configuracoes.email}
                        name="email"
                      />
                    </span>
                  </OverlayTrigger>
                </Form.Group>
                <Form.Group as={Col} controlId="senha" name="senha">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    placeholder="Senha atual da conta"
                    value={configuracoes.senha}
                    name="senha"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="demanda_ponta">
                  <Form.Label>Demanda contratada kW</Form.Label>
                  <Form.Control
                    type="number"
                    value={configuracoes.demanda_ponta}
                    name="demanda_ponta"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="demanda_fora_ponta">
                  <Form.Label>Demanda fora de ponta kW</Form.Label>
                  <Form.Control
                    type="number"
                    value={configuracoes.demanda_fora_ponta}
                    name="demanda_fora_ponta"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="limiar_atuacao">
                  <Form.Label>Limiar de atuação</Form.Label>
                  <Form.Control
                    type="number"
                    value={configuracoes.limiar_atuacao}
                    name="limiar_atuacao"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="tolerancia">
                  <Form.Label>Tolerância do controle %</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="100"
                    value={configuracoes.tolerancia}
                    name="tolerancia"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md={3} controlId="horario">
                  <Form.Label>Horário de Ponta</Form.Label>
                  <Form.Control
                    type="time"
                    value={configuracoes.horario_ponta}
                    name="horario_ponta"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} md={3} controlId="controlar_demanda">
                  <Form.Label>Controle</Form.Label>
                  <Form.Select
                    defaultValue={
                      configuracoes.controlar_demanda ? 'Ativo' : 'Desativado'
                    }
                    name="controlar_demanda"
                    onChange={handleChange}
                  >
                    <option>Ativo</option>
                    <option>Desativado</option>
                  </Form.Select>
                </Form.Group>
              </Row>
              <Button variant="success" type="submit" value="Enviar">
                Atualizar
              </Button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuracao;
