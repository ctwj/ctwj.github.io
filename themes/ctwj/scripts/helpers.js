hexo.extend.helper.register('hello_plugin', function(){
    // this.log('hello_plugin');
    // this.log(page);
    return "hello plugin";
});

hexo.extend.helper.register('is_show_appbar_nav', function(path){
    return /^categories\/(house|house_resold)/i.test(path);
});

hexo.extend.helper.register('is_appbar_nav_active', function(path, category){
    let reg = new RegExp(`^categories\/${category}`);
    return reg.test(path) ? 'active' : '';
});