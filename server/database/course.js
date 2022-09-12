const sqlite3 = require('sqlite3').verbose();

const dbname = 'mysqlite';
// 创建并连接一个数据库
const db = new sqlite3.Database(dbname);

const COURSE = 'course';
const USER = 'user';

class course {
    // 查询 分页 条件
    static all(data, callback) {
        const { page, page_size, ...params } = data;

        let select = `
            SELECT
                c.course_id,
                c.course_name,
                u.user_name
            FROM
                COURSE c
                JOIN USER u ON u.user_id = c.user_id
        `;
        let total = `
            SELECT COUNT(*) total FROM COURSE c
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
                        select += `c.${key} LIKE '%${params[key]}%'`;
                        total += `c.${key} LIKE '%${params[key]}%'`;
                        break;
                    default:
                        select += `c.${key} = ${params[key]}`;
                        total += `c.${key} = ${params[key]}`;
                }
            });
        }
        select += `
            ORDER BY
                c.course_id DESC
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
    static create(data, callback) {
        const { course_name = null, user_id = null } = data;
        const sql = `INSERT INTO COURSE(course_name, user_id) VALUES('${course_name}', ${user_id});`;
        db.run(sql, callback);
    }
    // 根据id 获取数据
    static find(id, callback) {
        if (!id) return callback(new Error(`缺少参数id`));
    	const sql = `SELECT * FROM COURSE WHERE course_id = ${id}`;
        db.get(sql, callback);
    }
    // 更新数据
    static update(data, callback) {
        const { id = null, course_name = null, user_id = null } = data;
        if (!id) return callback(new Error(`缺少参数id`));
        const sql = `UPDATE COURSE SET course_name = '${course_name}', user_id = ${user_id} WHERE course_id = ${id};`;
        db.run(sql, callback);
    }
    // 删除数据
    static delete(data, callback) {
        const { id = null } = data;
        if (!id) return callback(new Error(`缺少参数id`));
        const sql = `DELETE FROM COURSE WHERE course_id = ${id};`;
        db.run(sql, callback)
    }
}

module.exports = course;
