// 必要属性：label、path、active；如果有children，与父级格式一致
// active：url中只要有该值出现，则为激活状态
export default [
    {
        label: '账户管理',
        icon: 'fa fa-users font20',
        path: '/app/user/index',
        active: '/app/user',
        needSuperUser:1
    },
    {
        label: '基本面板',
        icon: 'fa fa-line-chart font20',
        path: '/app/cashTotal/index',
        active: '/app/cashTotal'
    },
    {
        label: '现金流动',
        icon: 'fa fa-money font20',
        path: '/app/cashFlow/index',
        active: '/app/cashFlow'
    },
    {
        label: '消费计划',
        icon: 'fa fa-shopping-cart font20',
        path: '/app/shopPlan/index',
        active: '/app/shopPlan'
    },
    {
        label: '系统数据',
        icon: 'fa fa-cogs font20',
        path: '/app/sys/index',
        active: '/app/sys'
    },
]