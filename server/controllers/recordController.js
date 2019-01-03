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
        console.log(rows)
        res.render('basicReport', { reports: rows })
    })
}
