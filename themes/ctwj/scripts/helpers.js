
/**
 * 是否需要显示 switch appbar
 */
hexo.extend.helper.register('is_show_appbar_nav', function(path){
    return /^categories\/(house|resold\-house)/i.test(path);
});

/**
 * 首层 category
 */
hexo.extend.helper.register('main_category', function(path, is_home, settings){
    const default_category = 'house';
    if (is_home) {
        return default_category;
    }
    let reg = new RegExp(`^categories\/(.*?)\/`);
    let result = path.match(reg);
    if (!result) {
        return default_category;
    }
    if (result.length) {
        return result[1];
    }
    return default_category;
});

/**
 * 二层 category
 */
hexo.extend.helper.register('sub_category', function(path, category){
    let reg = new RegExp(`^categories\/.*?\/(.*?)\/`);
    let result = path.match(reg);
    if (result.length) {
        return result[1];
    }
    return 'house';
});


const CATEGORY_ORDER = [
    { key: 'prepare-buy', value:  1 },
    { key: 'choose-house', value:  2 },
    { key: 'booking-contract', value:  3 },
    { key: 'loan', value:  4 },
    { key: 'tax', value:  5 },
    { key: 'check-house', value:  6 },
    { key: 'maintain-legal-rights', value:  7 },
    { key: 'prepare-decorate', value:  8 },
    { key: 'decorate-contract', value:  9 },
    { key: 'water-electricity', value:  10 },
    { key: 'kitchen-bath', value:  11 },
    { key: 'wall-ceil-floor', value:  12 },
    { key: 'door-window', value:  13 },
    { key: 'furniture', value:  14 },
    { key: 'appliances', value:  15 },
    { key: 'check-in', value:  16 },
];

/**
 *  category 排序
 */
 hexo.extend.helper.register('category_order', function(categories){
    // const orderFun = (a, b) => {
    //     return a['order'] - b['order'] ? 1 : -1;
    // }
    categories.map(item => {
        let slugArr = item.slug.split('/');
        const categoryEn = slugArr[slugArr.length - 1]; 
        let orderItem = CATEGORY_ORDER.find(item => item.key === categoryEn);
        if (!orderItem) {
            item.order = 1;
        }
        item.order = !orderItem ? 1 : orderItem.value;
        return item;
    });
    // this.log(categories.sort(orderFun));
    // return categories.sort(orderFun);
});




/**
 * appbar active 样式
 */
hexo.extend.helper.register('is_appbar_nav_active', function(path, category){
    let reg = new RegExp(`^categories\/${category}`);
    return reg.test(path) ? 'active' : '';
});


/**
 * 通过path 判断 base level
 */
hexo.extend.helper.register('level', function (base) {
    return base.split('/').filter(item => !['categories', ''].includes(item)).length;
});