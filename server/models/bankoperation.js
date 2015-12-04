import cozydb from 'cozydb'
import hasValue from '../hasValue'
import File from '../models/file'


const BankOperation = cozydb.getModel('bankoperation', {
    bankAccount: String,
    title: String,
    date: Date,
    amount: Number,
    raw: String,
    dateImport: Date,
    categoryId: String,
    binary: Object,
})

module.exports = BankOperation


BankOperation.all = (params, callback) => {
    BankOperation.request('byDate', params, callback)
}


// Set binary of given file (represented by its id) to the current operation
BankOperation.prototype.setBinaryFromFile = (fileId, callback) => {
    File.find(fileId, (err, file) => {
        if (err) {
            return callback(err)
        }

        const attributeExist = hasValue(file) && hasValue(file.binary) &&
                               hasValue(file.binary.file)
        if (attributeExist) {
            const attributes = {
                binary: {
                    file: file.binary.file,
                    fileName: file.name,
                    fileMime: file.mime,
                },
            }

            this.updateAttributes(attributes, (err2) => {
                if (err2) {
                    return callback(err2)
                }

                this.binary = {
                    file: file.binary.file,
                    fileName: file.name,
                    fileMime: file.mime,
                }
                callback()
            })
        } else {
            callback(new Error('No binary for this file #{fileId}'))
        }
    })
}
