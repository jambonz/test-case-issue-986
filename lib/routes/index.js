module.exports = ({logger, makeService}) => {
  require('./bad')({logger, makeService});
  require('./good')({logger, makeService});
};

