const qs = require('../node_modules/query-string/index.js');

// Expo Router uses __importStar(require('query-string')).
// Ensure named exports exist on the namespace object for Metro/interop.
module.exports = qs;
module.exports.default = qs;
module.exports.__esModule = true;
