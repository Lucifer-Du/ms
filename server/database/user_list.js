const sqlite3 = require('sqlite3').verbose();

const dbname = 'mysqlite';
// 创建并连接一个数据库
const db = new sqlite3.Database(dbname)

class user_list {
    // 获取所有数据
    static all(callback) {
    	// 使用sqlite3的all
        db.all('SELECT * FROM user_list', callback);
    }
    // 添加数据
    static create(data, callback) {
        const sql = `
                INSERT INTO
                user_list(name, account, password, role)
                VALUES(?, ?, ?, ?)
                ;select last_insert_rowid();`;
        db.run(sql, data.name, data.account, data.password, data.role, callback);
    }
    // 根据id 获取数据
    static find(id, callback) {
        if (!id) return callback(new Error(`缺少参数id`));
    	// 使用sqlite3的get
        db.get('SELECT * FROM user_list WHERE id = ?', id, callback);
    }
    // 更新数据
    static update(data, callback) {
        if (!data.id) return callback(new Error(`缺少参数id`));
        const sql = `
            UPDATE user_list
            SET name=?, role=?
            WHERE id=?
        `
        db.run(sql, data.name, data.role, data.id, callback)
    }
    // 删除数据
    static delete(id, callback) {
        if (!id) return callback(new Error(`缺少参数id`));
        db.run('DELETE FROM user_list WHERE id=?', id, callback)
    }
}

module.exports = user_list;
