const pageNotFound = (req, res) => {
  res.status(400).send({
    message: "Duong dan khong ton tai",
    originalUrl: req.originalUrl,
  });
};

module.exports = pageNotFound
