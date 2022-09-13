const sqlite3 = require('sqlite3').verbose();

const dbname = 'mysqlite';
// 创建并连接一个数据库
const db = new sqlite3.Database(dbname)

// // 创建一个articles表
// db.serialize(() => {
//     const sql = `
//         CREATE TABLE IF NOT EXISTS articles
//         (id integer primary key,title,content TEXT)
//     `;
//     // 如果没有articles表,创建一个
//     db.run(sql);
// });

// Articles API
class Users {
    // 获取所有文章
    static all(cb) {
    	// 使用sqlite3的all
        db.all('SELECT * FROM users', cb);
    }
}

module.exports.Users = Users;
