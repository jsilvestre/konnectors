import cozydb from 'cozydb'
import hasValue from '../hasValue'
import printit from 'printit'

const log = printit({ prefix: 'konnectors:models:cozy_instance' })


// Required to get locale and domain data.
const CozyInstance = cozydb.getModel('CozyInstance', {
    id: String,
    domain: String,
    locale: String,
    connectedOnce: Boolean,
    background: String,
})

module.exports = CozyInstance


// Retrieve cozy instance object.
CozyInstance.first = (callback) => {
    CozyInstance.request('all', (err, instances) => {
        if (err) {
            callback(err)
        } else if (!instances || instances.length === 0) {
            callback(null, null)
        } else {
            callback(null, instances[0])
        }
    })
}


// Extract locale parameter from instance object.
CozyInstance.getLocale = (callback) => {
    CozyInstance.request('all', (err, instances) => {
        if (err) {
            log.error(err)
        }

        let instance = 'en'
        if (hasValue(instances) && hasValue(instances[0])) {
            instance = instances[0].locale
        }
        callback(null, instance)
    })
}


// Extract URL parameter from instance object.
CozyInstance.getURL = (callback) => {
    CozyInstance.first((err, instance) => {
        if (err) {
            callback(err)
        } else if (hasValue(instance) && instance.domain) {
            const url = instance.domain
                .replace('http://', '')
                .replace('https://', '')
            callback(null, `https://${url}/`)
        } else {
            callback(new Error('No instance domain set'))
        }
    })
}
