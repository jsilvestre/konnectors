import cozydb from 'cozydb'
import hasValue from '../hasValue'
import printit from 'printit'

const log = printit({ prefix: 'event:model' })

const Event = cozydb.getModel('Event', {
    start: String,
    end: String,
    place: String,
    details: String,
    description: String,
    rrule: String,
    tags: (x) => x, // DAMN IT JUGGLING
    attendees: [Object],
    related: {
        type: String,
        default: null,
    },
    timezone: String,
    alarms: [Object],
    created: String,
    lastModification: String,
    caldavuri: String,
})

module.exports = Event

require('cozy-ical').decorateEvent(Event)

Event.all = (params, callback) => {
    Event.request('all', params, callback)
}

Event.byCalendar = (calendarId, callback) => {
    Event.request('byCalendar', { key: calendarId }, callback)
}

Event.createOrUpdate = (data, callback) => {
    const { id } = data
    data.caldavuri = id
    data.docType = 'Event'
    delete data._id
    delete data._attachments
    delete data._rev
    delete data.binaries
    delete data.id

    Event.request('bycaldavuri', { key: id }, (err, events) => {
        if (hasValue(err)) {
            log.error(err)
            Event.create(data, callback)
        } else if (events.length === 0) {
            Event.create(data, callback)
        } else if (data.caldavuri === events[0].caldavuri) {
            log.debug('Event already exists, updating...')
            const event = events[0]

            // Only update attributes that should not be changed by the user
            if (data.start !== event.start
                || data.end !== event.end
                || data.place !== event.place
                || data.description !== event.description
                || data.details !== event.details) {
                // clone object
                const oldValue = event.toJSON() // clone the object properties
                event.updateAttributes({
                    start: data.start,
                    end: data.end,
                    place: data.place,
                    description: data.description,
                    details: data.details,
                }, (err2) => {
                    event.beforeUpdate = oldValue
                    callback(err2, event)
                })
            } else {
                callback(null, event)
            }
        } else {
            Event.create(data, callback)
        }
    })
}

Event.getInRange = (options, callback) => {
    Event.request('byDate', options, callback)
}
