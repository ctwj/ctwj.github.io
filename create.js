#!/usr/bin/env node
const fs = require('fs');
var argv = require('yargs').argv;

const printHelp = () => {
    console.log(' usage: ./create.js --template template.md --data data.json --target=./source/_posts/house/booking_contract/');
    console.log(' params:');
    console.log('   --data   处理的json数据');
    console.log('   --target 存储文件的位置');
    console.log('   --template 模板文件');
}

const getData = (path) => {
    try {

        const data = fs.readFileSync(path, 'utf8');
    
        // parse JSON string to JSON object
        const config = JSON.parse(data);
    
        return config;
    
    } catch (err) {
        console.log(`Error reading file from disk: ${err}`);
    }
}

const main = ({data, template, target}) => {
    let targetDir = target || './source/_posts/house/prepare_buy/';
    let templateFile = template || './themes/ctwj/_demo/template/article.md';
    let jsonFile = data || './themes/ctwj/_demo/data/new/买房准备.json';

    if (!targetDir || !templateFile || !jsonFile) {
        return printHelp();
    }
    let json = getData(jsonFile);
    const articleList = json.data.articleList || [];
    console.log(articleList);
}

const renderContent = (data, template) => {
    let ejs = require('ejs');
    let html = ejs.render(template, data);
    return html;
}

main(argv);