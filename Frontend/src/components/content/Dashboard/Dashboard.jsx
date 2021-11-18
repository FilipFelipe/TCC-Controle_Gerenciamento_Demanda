import React, { useEffect, useState } from 'react';
import style from './Dashboard.module.css';
import { DASHBOARD_ALL } from '../../../api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import Datatable from '../../ui/misc/Datatable';
import { useDispatch, useSelector } from 'react-redux';
import { changeMainHeaderTitle } from '../../../store/ui';
const initialState = {};

const Dashboard = () => {
  const [media, setMedia] = useState(initialState);
  const [mediaMin, setMediaMin] = useState(initialState);
  const [controle, setControle] = useState(initialState);
  const [confLoading, setConfLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeMainHeaderTitle('Dashboard'));
  }, [dispatch]);

  const menuState = useSelector((state) => state.ui.toggleMenu);

  useEffect(() => {
    const buscarConfig = async () => {
      try {
        setConfLoading(true);
        const { url, options } = DASHBOARD_ALL();
        const resposta = await fetch(url, options);
        const json = await resposta.json();
        if (!resposta.ok) {
          throw new Error('Erro ao buscar dispositivos.');
        }
        setMedia(json[0].media_dias);
        setMediaMin(json[0].media_min);
        setControle({
          demanda: json[0].ultimaDemanda,
          status: json[0].controle_status,
          monitoramento: json[0].controle_monitoramento,
        });
      } catch (error) {
        toast.error('Error em carregar os dados! ' + error);
      } finally {
        setConfLoading(false);
      }
    };
    buscarConfig();
  }, [menuState]);

  return (
    <>
      <div className={style.dashboard}>
        <div className={style.grade}>
          <div className={style.retangulo}>
            <div>Última Demanda:</div>
            {confLoading ? (
              <div className={style.carregando_texto}>
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className={style.retangulo_texto}> {controle.demanda}kW</div>
            )}
          </div>
          <div className={style.retangulo}>
            <div>Monitoramento: </div>
            {confLoading ? (
              <div className={style.carregando_texto}>
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className={style.retangulo_texto}>
                {controle.monitoramento ? (
                  <div className={style.retangulo_texto}>
                    Ativo <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                ) : (
                  <div className={style.retangulo_texto_error}>
                    Desativado <FontAwesomeIcon icon={faTimesCircle} />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={style.retangulo}>
            <div>Controle:</div>
            {confLoading ? (
              <div className={style.carregando_texto}>
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className={style.retangulo_texto_error}>
                {controle.status ? (
                  <div className={style.retangulo_texto}>
                    Ativo <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                ) : (
                  <div className={style.retangulo_texto_error}>
                    Desativado <FontAwesomeIcon icon={faTimesCircle} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className={style.grafico}>
          {confLoading ? (
            <div className={style.carregando}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                width="100%"
                height="100%"
                data={mediaMin || []}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="Demanda"
                  stroke="#26DEA7"
                  fill="#26DEA7"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className={style.grade_footer}>
          <div className={style.graficoGeral}>
            {confLoading ? (
              <div className={style.carregando}>
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width="100%"
                  height="100%"
                  data={media || []}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  barSize={20}
                >
                  <XAxis
                    dataKey="name"
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Bar
                    dataKey="Demanda"
                    name="Média"
                    fill="#8884d8"
                    background={{ fill: '#eee' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className={style.logs}>
            <div className={style.configuracao_table}>
              <Datatable
                striped
                bordered
                hover
                responsive
                data={[
                  {
                    Local: 'Sala 10',
                    Equipamento: 'Máquina',
                    Valor: '10W',
                    Prior: '2',
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
