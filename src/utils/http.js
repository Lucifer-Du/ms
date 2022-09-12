import axios from 'axios';

var instance = axios.create({
    // baseURL: 'http://localhost:3002',
    baseURL: '',
    timeout: 2500
});

instance.interceptors.request.use((config) => {
    return config
}, (error) => {
    return Promise.reject(error)
})

instance.interceptors.response.use((response) => {
    let { data } = response
    return data
}, (error) => {
    return Promise.reject(error)
})

const post = (url, data) => {
    return new Promise((resolve, reject) => {
        //这里的instance与实例化axios的变量名一致
        instance.post(url, data).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

const get = (url, data) => {
    return new Promise((resolve, reject) => {
        //这里的instance与实例化axios的变量名一致
        instance.get(url, { params: data }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export { get, post };
