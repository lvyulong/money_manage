import Resource from 'app/common/resource/base';

const cashFlowApi = new Resource({
    url: 'cash-flow',
    actions: [
        {
            name:'expense',
            url:'expense',
            method:'GET'
        },
        {
            name:'expensePie',
            url:'expense-pie',
            method:'GET'
        },
        {
            name:'income',
            url:'income',
            method:'GET'
        },
        {
            name:'net',
            url:'net',
            method:'GET'
        },
    ]
});

export default cashFlowApi;
