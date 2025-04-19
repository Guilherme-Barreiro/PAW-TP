exports.isAdmin = (req, res, next) => {
    if (req.session?.user?.role === 'admin') {
      return next();
    }
    res.status(403).send('Acesso restrito');
};