import mqtt from '../config/mqtt';

export default () =>
  setInterval(() => {
    publishMonofasico();
    publishMonofasico_1();
    publishTrifasico();
    console.log('Published');
  }, 5000);

const publishTrifasico = () => {
  mqtt.publish(
    '/dispositivos/trifasicos/medicoes',
    JSON.stringify({
      mac: '00:E0:4C:63:A3:8B',
      pt1: 1,
      pc1: 2,
      pt2: 3,
      pc2: 4,
      pt3: 5,
      pc3: 6,
      t1: 220,
      c1: 5,
      t2: 220,
      c2: 12,
      t3: 220,
      c3: 7,
    }),
  );
};

const publishMonofasico = () => {
  mqtt.publish(
    '/dispositivos/medicoes',
    JSON.stringify({
      mac: '00:E0:4C:76:67:E2',
      pc: 1,
      c: 9,
    }),
  );
};

const publishMonofasico_1 = () => {
  mqtt.publish(
    '/dispositivos/medicoes',
    JSON.stringify({
      mac: '00:E0:4C:76:67:E2',
      pt: 2,
      pc: 3,
      c: 15,
      t: 220,
    }),
  );
};
