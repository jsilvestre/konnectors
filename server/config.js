import americano from 'americano'
import path from 'path'
import getTemplateExt from './lib/get_template_ext'

module.exports = {
    common: {
        set: {
            'view engine': getTemplateExt(),
            'views': path.resolve(__dirname, '../client'),
        },

        engine: {
            js: (templatePath, locales, callback) => {
                callback(null, require(templatePath)(locales))
            },
        },

        use: [
            americano.bodyParser(),
            americano.methodOverride(),
            americano.errorHandler({
                dumpExceptions: true,
                showStack: true,
            }),
            americano.static(path.join(__dirname, '..', 'client', 'public')),
        ],
    },

    development: [
        americano.logger('dev'),
    ],

    production: [
        americano.logger('short'),
    ],

    plugins: [
        'cozydb',
    ],
}
