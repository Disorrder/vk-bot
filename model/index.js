var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:superbot@ds135680.mlab.com:35680/disordered');

require('./User');
require('./Bot');
