module.exports = (res) => {
  return res.status(401).json({ msg: 'Usuário não autenticado' });
};
