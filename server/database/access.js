const sqlite3 = require('sqlite3').verbose();

const dbname = 'mysqlite';
// 创建并连接一个数据库
const db = new sqlite3.Database(dbname);

const ACCESS = 'access';

class access {
    // 查询 分页 条件
    static all({ page = 1, page_size = 10, ...params }, callback) {
        let select = `
            SELECT
                *
            FROM
                ACCESS
        `;
        let total = `
            SELECT COUNT(*) total FROM ACCESS
        `;
        if (Object.keys(params).length > 0) {
            select += 'WHERE '
            total += 'WHERE ';
            Object.keys(params).forEach((key, index) => {
                if (index > 0) {
                    select += ' AND ';
                    total += ' AND ';
                }
                switch(key) {
                    case 'user_name':
                    case 'account':
                        select += `${key} LIKE '%${params[key]}%'`;
                        total += `${key} LIKE '%${params[key]}%'`;
                        break;
                    default:
                        select += `${key} = ${params[key]}`;
                        total += `${key} = ${params[key]}`;
                }
            });
        }
        select += `
            ORDER BY
                access_id DESC
        `;
        if (page) {
            select += `
                LIMIT ${page_size}
                OFFSET ${(page - 1) * page_size}
            `;
        }
        const db_select = new Promise((resolve, reject) => {
            db.all(`${select};`, (err, res) => {
                if (err) reject(err)
                resolve(res)
            });
        });
        const db_total = new Promise((resolve, reject) => {
            db.all(`${total};`, (err, res = []) => {
                if (err) reject(err)
                const [data = {}] = res;
                const { total = 0 } = data;
                resolve(total)
            });
        });
        Promise.all([
            db_select,
            db_total
        ]).then(res => {
            const [list, total] = res;
            callback(null, { list, total });
        }).catch(err => {
            callback(err, {});
        });
    };
    // 添加数据
    static create({ name = null }, callback) {
        const sql = `INSERT INTO ACCESS(access_name) VALUES(${name});`;
        db.run(sql, callback);
    }
    // 根据id 获取数据
    static find(id, callback) {
        if (!id) return callback(new Error(`缺少参数id`));
    	const sql = `SELECT * FROM ACCESS WHERE access_id = ${id};`;
        db.get(sql, callback);
    }
    // 更新数据
    static update({ id = null, access_name = null }, callback) {
        if (!id) return callback(new Error(`缺少参数id`));
        const sql = `UPDATE ACCESS SET access_name = ${access_name} WHERE access_id = ${id};`;
        db.run(sql, callback)
    }
    // 删除数据
    static delete({ id = null }, callback) {
        if (!id) return callback(new Error(`缺少参数id`));
        const sql = `DELETE FROM ACCESS WHERE access_id = ${id};`;
        db.run(sql, callback)
    }
}

module.exports = access;
