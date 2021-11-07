module.exports = (res, msg) => {
  return res.status(403).json({ msg });
};
