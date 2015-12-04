import americano from 'americano'
import hasValue from './server/hasValue'
import initKonnectors from './server/init/konnectors'
import localization from './server/lib/localization_manager'
import poller from './server/lib/poller'
import printit from 'printit'
import realtimeAdapter from 'cozy-realtime-adapter'

const log = printit({ prefix: 'konnectors' })

process.env.TZ = 'UTC'

const params = {
    name: 'konnectors',
    port: process.env.PORT || 9358,
    host: process.env.HOST || '127.0.0.1',
    root: __dirname,
}

export default function application(callback) {
    americano.start(params, (app, server) => {
        // Configure realtime manager.
        realtimeAdapter(server, [
            'konnector.update',
            'folder.*',
        ])

        localization.initialize(() => {
            initKonnectors(() => {
                poller.start()
                log.info('Import poller started.')
                if (hasValue(callback)) {
                    callback(app, server)
                }
            })
        })
    })
}

if (!module.parent) {
    application()
}
