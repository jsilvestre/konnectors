// Placeholder model to be able to manipulate binaries directly.
// (see models/file::destroyWithBinary)

import cozydb from 'cozydb'
const Binary = cozydb.getModel('Binary', {})
module.exports = Binary
