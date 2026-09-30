const qs = require('__xpertppc_query_string_impl');

// Expo Router uses __importStar(require('query-string')).
// Ensure named exports exist on the namespace object for Metro/interop.
module.exports = qs;
module.exports.default = qs;
module.exports.__esModule = true;
