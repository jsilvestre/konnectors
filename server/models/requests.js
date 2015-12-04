import americano from 'americano'

module.exports = {
    bill: {
        byDate: americano.defaultRequests.by('date'),
    },

    konnector: {
        all: americano.defaultRequests.all,
    },

    bankoperation: {
        byDate: americano.defaultRequests.by('date'),
    },

    folder: {
        byFullPath: (doc) => emit(`${doc.path}/${doc.name}`, doc),
    },

    file: {
        byFullPath: (doc) => emit(`${doc.path}/${doc.name}`, doc),
    },

    steps: {
        byDate: americano.defaultRequests.by('date'),
    },

    sleep: {
        byDate: americano.defaultRequests.by('date'),
    },

    commit: {
        byDate: americano.defaultRequests.by('date'),
    },

    event: {
        all: americano.defaultRequests.all,
        bycaldavuri: americano.defaultRequests.by('caldavuri'),
    },

    tag: {
        byName: (doc) => emit(doc.name, doc),
    },
}
