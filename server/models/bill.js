import cozydb from 'cozydb'


const Bill = cozydb.getModel('Bill', {
    type: String,
    date: Date,
    vendor: String,
    amount: Number,
    plan: String,
    pdfurl: String,
    binaryId: String,
    fileId: String,
})

module.exports = Bill


Bill.all = (callback) => {
    Bill.request('byDate', callback)
}
