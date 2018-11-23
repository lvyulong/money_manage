import Resource from 'app/common/resource/base';

const cashTotalApi = new Resource({
    url: 'cash-total',
    actions: [
        {
            name:'trend',
            url:'trend',
            method:'GET'

        }
    ]
});

export default cashTotalApi;
