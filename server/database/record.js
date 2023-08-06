const sqlite3 = require('sqlite3').verbose();

const dbname = 'mysqlite';
// 创建并连接一个数据库
const db = new sqlite3.Database(dbname);

class record {
    // 查询 分页 条件
    static all({ page = 1, page_size = 10, ...params }, callback) {
        db.all('SELECT course_id FROM COURSE', (err, list = []) => {
            if (err) return callback(err);
            
            const db_select = new Promise((resolve, reject) => {
                let select = `
                    SELECT
                        u.account,
                        u.user_id,
                        u.user_name,
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
                let sql = `
                    SELECT
                        rank.*
                    FROM
                        (
                            SELECT
                                ROW_NUMBER() OVER ( ORDER BY list.total DESC ) AS rank,
                                list.* 
                            FROM (${select}) list
                        ) rank
                `;
                if (Object.keys(params).length > 0) {
                    sql += 'WHERE ';
                    Object.keys(params).forEach((key, index) => {
                        if (index > 0) {
                            sql += ' AND ';
                        }
                        switch(key) {
                            case 'user_name':
                            case 'account':
                                sql += `rank.${key} LIKE '%${params[key]}%'`;
                                break;
                            default:
                                sql += `rank.${key} = ${params[key]}`;
                        }
                    });
                }
                if (page) {
                    sql += `
                        LIMIT ${page_size}
                        OFFSET ${(page - 1) * page_size}
                    `;
                }
                db.all(sql, (err, res) => {
                    if (err) reject(err)
                    resolve(res)
                });
            });
            const db_total = new Promise((resolve, reject) => {
                let total = `
                    SELECT
                        u.user_id,
                        u.user_name,
                        u.account
                    FROM
                        RECORD r
                        JOIN USER u ON u.user_id = r.user_id
                    GROUP BY
                        r.user_id
                `;
                let sql = `
                    SELECT
                        COUNT(*) AS total
                    FROM (${total}) list
                `;
                if (Object.keys(params).length > 0) {
                    sql += 'WHERE ';
                    Object.keys(params).forEach((key, index) => {
                        if (index > 0) {
                            sql += ' AND ';
                        }
                        switch(key) {
                            case 'user_name':
                            case 'account':
                                sql += `list.${key} LIKE '%${params[key]}%'`;
                                break;
                            default:
                                sql += `list.${key} = ${params[key]}`;
                        }
                    });
                }
                db.all(`${sql};`, (err, res = []) => {
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
        });
    };
    // 添加数据
    static create({ user_id = null, course_id = null, course_record = null }, callback) {
        let sql = `INSERT INTO RECORD(user_id, course_id, course_record) VALUES`;
        course_id = course_id.split(',').map(Number);
        course_record = course_record.split(',');
        course_id.forEach((value, index) => {
            if (index > 0) {
                sql += ` `;
            }
            sql += `(${user_id}, ${value}, ${course_record[index]});`;
        });
        db.run(sql, callback);
    }
    // 根据id 获取数据
    static find(id, callback) {
        if (!id) return callback(new Error(`缺少参数id`));
        // const sql = `
        //     SELECT
        //         u.user_id,
        //         u.user_name,
        //         MAX(CASE r.course_id WHEN 1 THEN r.course_record ELSE '' END) course_1,
        //         MAX(CASE r.course_id WHEN 2 THEN r.course_record ELSE '' END) course_2,
        //         MAX(CASE r.course_id WHEN 3 THEN r.course_record ELSE '' END) course_3,
        //         MAX(CASE r.course_id WHEN 4 THEN r.course_record ELSE '' END) course_4,
        //         MAX(CASE r.course_id WHEN 5 THEN r.course_record ELSE '' END) course_5
        //         FROM
        //             RECORD r
        //             JOIN USER u ON r.user_id = u.user_id
        //         WHERE r.user_id = ${id}
        //     GROUP BY
        //         r.user_id;
        // `;
        db.all('SELECT course_id FROM COURSE', (err, list = []) => {
            if (err) return callback(err);
            let sql = `
                SELECT
                    u.user_id,
            `;
            list.forEach((item, index) => {
                const [course_id] = Object.values(item);
                sql += `
                    MAX( CASE r.course_id WHEN ${course_id} THEN r.course_record ELSE '' END ) course_${course_id}${index < list.length - 1 ? ',' : ''}
                `;
            });
            sql += `
                FROM
                    RECORD r
                    JOIN USER u ON u.user_id = r.user_id 
                WHERE r.user_id = ${id}
                GROUP BY
                    r.user_id;
            `;
            db.get(sql, callback);
        });
    }
    // 更新数据
    static update({ user_id = null, course_id = null, course_record = null }, callback) {
        let sql = `DELETE FROM RECORD WHERE user_id = ${user_id};`;
        course_id = course_id.split(',');
        course_record = course_record.split(',');
        course_id.forEach((id, index) => {
            sql += `REPLACE INTO RECORD(user_id, course_id, course_record) VALUES (${user_id}, ${id}, ${course_record[index]});`;
        });
        db.exec(sql, callback);
    }
    // 删除数据
    static delete({ id = null }, callback) {
        if (!id) return callback(new Error(`缺少参数id`));
        const sql = `DELETE FROM RECORD WHERE user_id = ${id};`;
        db.exec(sql, callback);
    }
}

module.exports = record;
