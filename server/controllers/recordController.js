var sqlite = require('sqlite3');
var constant = require('../constant');
class Record {
    constructor(langID, lineCount, time) {
        this.langID = langID
        this.lineCount = lineCount
        this.time = time
    }
}

exports.basic_report = function (req, res, next) {
    // get all record from DB
    console.log(constant.dbPath)
    let DB = new sqlite.Database(constant.dbPath,sqlite.OPEN_READWRITE,(err)=>{
        if(err){
          console.log(err)
        }
      });

    var sql = 'select fileType as name, sum(count) as value from record group by fileType'
    console.log(sql)
    DB.all(sql,(err, rows) => {
        if (err) {
            return next(err)
        }
        res.render('basicReport', { reports: rows })        
    })
}

exports.detail_report_post = function (req,res,next) {
    var start = req.body.start;
    var end = req.body.end;
    if(end < start){
        res.render('detailReport',{title:'Detail Report',errors:new Error('start date can\'t be later than end date')})
        return
    }
    startSec = new Date(start).getTime();
    endSec = new Date(end).getTime();
    var sql = `select fileType as name,sum(count) as value from record where time <=${endSec} and time >=${startSec} group by fileType`;
    console.log(sql)
    let DB = new sqlite.Database(constant.dbPath,sqlite.OPEN_READWRITE,(err)=>{
        if(err){
          console.log(err)
        }
      });
    DB.all(sql,(err,rows)=>{
        if(err){
            res.render('detailReport',{title: 'Detail Report', errors: err})
            return next(err)
        }
        console.log(rows)
        var gap = Math.ceil((endSec-startSec)/(1000*3600*24))
        var line = 0
        rows.forEach((x)=>{
            line+=x.value
        })
        var piechat = []
        rows.forEach((x)=>{
            piechat.push([x.name,x.value])
        })
        console.log(JSON.stringify(piechat))
        res.render('detailReport',{title:'Detail Report',report:{gap:gap,line:line,piechart:JSON.stringify(piechat),start:start, end:end}})
        return
    })
}

exports.detail_report_get = function (req,res,next){
    res.render('detailReport',{title:'Detail report'})
}