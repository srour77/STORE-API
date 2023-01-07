const model = require('../models/product')

async function getAllProducts(req, res, next) {
    let queryObj = {}
    for(let prop in req.query){
        addProps(queryObj, prop, req.query[prop])
    }

    let numricFilters = req.query.numricFilters
    if(numricFilters){
        for(let filter of numricFilters.split(',')){
            addNumericFilters(queryObj, filter)
        }
    }

    let sortMethod = (req.query.sort) ? req.query.sort.split(',').join(' ') : ''
    let fields = (req.query.fields) ? req.query.fields.split(',').join(' ') : ''
    let limit = req.query.limit
    let skip = (req.query.page -1) * limit

    let products =  await model.find(queryObj)
    .skip(Number(skip))
    .limit(Number(limit))
    .sort(sortMethod)
    .select(fields)

    if(!products){
        return res.status(500).json({'msg': 'no retieved data'})
    }
    res.status(200).json({products})
}

function addNumericFilters(queryObj, filter) {
    const operatorMap = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
    }
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    const props = new Set(['rating', 'price'])

    let matchLen, matchIndex
    filter = filter.replace(regEx, function(match) {
        let replace = `${operatorMap[match]}`
        matchLen = replace.length
        matchIndex = filter.indexOf(match)
        return replace
    })

    let prop = filter.substring(0, filter.indexOf('$'))
    let op = filter.substr(filter.indexOf('$'), matchLen)
    let num = Number(filter.substring(matchIndex + matchLen))
    if (props.has(prop)) {
        queryObj[prop] = {[op]: num};
    }
}

function addProps(queryObj, key, value){
    const props = new Set(['name', 'company', 'featured'])
    if(props.has(key) && value.length > 0){
        queryObj[key] = value
    }
}

module.exports = {
    getAllProducts
}
