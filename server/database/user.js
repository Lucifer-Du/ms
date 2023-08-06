const sqlite3 = require('sqlite3').verbose();

const dbname = 'mysqlite';
// 创建并连接一个数据库
const db = new sqlite3.Database(dbname);

class user {
    // 查找用户账号
    static query_account({ account }, callback) {
        const sql = `
            SELECT
                u.user_id,
                u.user_name,
                u.password, 
                a.access_id,
                a.access 
            FROM
                USER u
                JOIN ACCESS a ON a.access_id = u.access_id
            WHERE
                u.account = '${account}'
        `;
        db.get(sql, callback);
    }
    // 查询 分页 条件
    static all({ page = 1, page_size = 10, ...params }, callback) {
        let select = `
            SELECT
                u.user_id,
                u.user_name,
                u.account,
                u.password,
                a.access_id,
                a.access_name 
            FROM
                USER u
                JOIN ACCESS a ON a.access_id = u.access_id
            WHERE
                u.access_id != 1
        `;
        let total = `
            SELECT COUNT(*) total FROM USER u WHERE u.access_id != 1
        `;
        if (Object.keys(params).length > 0) {
            // select += 'WHERE '
            // total += 'WHERE ';
            Object.keys(params).forEach((key, index) => {
                // if (index > 0) {
                    select += ' AND ';
                    total += ' AND ';
                // }
                switch(key) {
                    case 'user_name':
                    case 'account':
                        select += `u.${key} LIKE '%${params[key]}%'`;
                        total += `u.${key} LIKE '%${params[key]}%'`;
                        break;
                    default:
                        select += `u.${key} = ${params[key]}`;
                        total += `u.${key} = ${params[key]}`;
                }
            });
        }
        select += `
            ORDER BY
                user_id DESC
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
    static create({ user_name = null, account = null, password = null, access_id = null }, callback) {
        const sql = `INSERT INTO USER (user_name, account, password, access_id) VALUES ('${user_name}', '${account}', '${password}', ${access_id});`;
        db.run(sql, callback);
    }
    // 根据id 获取数据
    static find(id, callback) {
        if (!id) return callback(new Error(`缺少参数id`));
    	const sql = `SELECT * FROM USER WHERE user_id = ${ id};`;
        db.get(sql, callback);
    }
    // 更新数据
    static update({ id = null, user_name = null, account = null, password = null, access_id = null }, callback) {
        if (!id) return callback(new Error(`缺少参数id`));
        const sql = `UPDATE USER SET user_name = '${user_name}', account = ${account}, password = ${password}, access_id = ${access_id} WHERE user_id = ${ id };`;
        db.run(sql, callback);
    }
    // 删除数据
    static delete({ id = null }, callback) {
        if (!id) return callback(new Error(`缺少参数id`));
        const sql = `DELETE FROM USER WHERE user_id = ${id};`;
        db.run(sql, callback)
    }
    // 查询用户相关信息
    static query_userinfo({ user_id = null, access_id = null }, callback) {
        let sql = '';
        switch(access_id) {
            case 2:
                // teacher
                sql = `
                    SELECT
                        (SELECT COURSE.course_name FROM COURSE WHERE COURSE.course_id = r.course_id) as course_name,
                        (SELECT USER.user_name FROM USER WHERE USER.user_id = r.user_id) as user_name,
                        r.course_record
                    FROM
                        COURSE c
                        JOIN USER u ON u.user_id = c.user_id
                        JOIN RECORD r ON r.course_id = c.course_id 
                    WHERE
                        u.user_id = ${user_id};
                `;
                db.all(sql, callback);
                break;
            case 3:
                // student
                db.all('SELECT course_id FROM COURSE', (err, list = []) => {
                    if (err) return callback(err, {});
                    let select = `
                        SELECT
                            u.user_id,
                    `;
                    list.forEach(item => {
                        const [course_id] = Object.values(item);
                        select += `
                            MAX( CASE r.course_id WHEN ${course_id} THEN r.course_record ELSE '' END ) course_${course_id},
                        `;
                    });
                    select += `
                            SUM( r.course_record ) total
                        FROM
                            RECORD r
                            JOIN USER u ON u.user_id = r.user_id 
                        GROUP BY
                            r.user_id
                    `;
                    const sql = `
                        SELECT
                            rank.*
                        FROM
                            (
                                SELECT
                                    ROW_NUMBER() OVER ( ORDER BY list.total DESC ) AS rank,
                                    list.* 
                                FROM
                                    (${select}) list
                            ) rank
                        WHERE
                            rank.user_id = ${user_id};
                    `;
                    db.get(sql, callback);
                });
                break;
        }
    }
}

module.exports = user;
