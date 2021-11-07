module.exports = (req, res, next) => {
  if (req.user.administrador) {
    next();
  } else {
    res.status(403).send('Usuário não é administrador.');
  }
};
