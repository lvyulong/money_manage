import Resource from 'app/common/resource/base';

const authApi = new Resource({
    url: 'auth',
    actions: [
        {
            name:'current',
            method:'GET',
            url:'current'
        },
        {
            name:'pre',
            method:'POST',
            url:'pre'
        },
        {
            name:'login',
            method:'POST',
            url:'login'
        },
        {
            name:'logout',
            method:'POST',
            url:'logout'
        },
        {
            name:'register',
            method:'POST',
            url:'register'
        },
    ]
});

export default authApi;
