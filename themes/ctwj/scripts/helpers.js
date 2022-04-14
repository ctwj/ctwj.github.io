hexo.extend.helper.register('log1', function(data ){
    this.log(data);
});

/**
 * 是否需要显示 switch appbar
 */
hexo.extend.helper.register('is_show_appbar_nav', function(path){
    return /^categories\/(house|house_resold)/i.test(path);
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

/**
 * 二层 category_list
 */
 hexo.extend.helper.register('sub_category_list', function(categories, category){
    // this.log('sub_category_list', category);
    const cate = categories.data.find(item => item.name === category);
    // this.log(cate, categories.data[0].name, category);
    // const items = categories.filter(category => category.parent === item._id);
    // this.log('sub_category', items);
    // return items;
    return [1,2];
});


/**
 * appbar active 样式
 */
hexo.extend.helper.register('is_appbar_nav_active', function(path, category){
    let reg = new RegExp(`^categories\/${category}`);
    return reg.test(path) ? 'active' : '';
});