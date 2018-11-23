import Resource from 'app/common/resource/base';

const shopPlanApi = new Resource({
    url: 'shop-plan',
    actions: [
        {
            name:'complete',
            url:'complete',
            method:'POST'
        }
    ]
});

export default shopPlanApi;
