#!/usr/bin/env node
const fs = require('fs');
const request = require('request');
var argv = require('yargs').argv;

const category1 = '新房';
const category2 = '买房准备';
const targetPath = './source/_posts/house/prepare_buy/';
const dataFile = './themes/ctwj/_demo/data/new/买房准备.json';

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

const getTemplate = (template) => {
    try {
        const data = fs.readFileSync(template, 'utf8');
        return data;
    } catch (err) {
        console.log(`Error reading file from disk: ${err}`);
    }
}

const parseArticle = (jsonData) => {
    // console.log(jsonData);
    let result = [];
    jsonData.forEach(listObj => {
        let tag = listObj.subTypeName;
        listObj.list.forEach(item => {
            // console.log(item);
            result.push({
                category1: category1,
                category2: category2,
                articleId: item.articleId,
                imageUrl: item.imageUrl,
                targetUrl: item.targetUrl,
                title: item.title,
                tag: tag,
            });
        });
    });
    return result;
}

const fetchArticleContent = async (article, template, target, saveArticle) => {
    let a = request(article.targetUrl, (error, response, body) => {
        // console.log(body);
        // img src="http://shop.img.huishuaka.com/imgs/windows/2018/5/26/2bd6dde9-fee6-45ee-bb6e-bb74a759.png"
        // img\ssrc=\"(.*?)\"
        const match = body.match(/img\ssrc=\"(.*?)\"/);
        // console.log(article);
        if (match && match [1]) {
            article['image'] = match[1];

            // 
            renderContent(article, template);
            saveArticle(article, target);
        } else {
            console.log('error ', article.articleId);
        }
    });
}

// 保存
const saveArticle = (article, target) => {
    // console.log(article, target);
    const file = `${target}${article.articleId}.md`;
    fs.writeFile(file, article.content, {flag: 'w'}, function (err) {
        if(err) {
         console.error(err);
         } else {
            console.log('写入成功', file);
         }
     });
}

// enter
const main = ({data, template, target}) => {
    let targetDir = target || targetPath;
    let templateFile = template || './themes/ctwj/_demo/template/article.md';
    let jsonFile = data || dataFile;

    if (!targetDir || !templateFile || !jsonFile) {
        return printHelp();
    }
    let json = getData(jsonFile);
    const articleJsonData = json.data.articleList || [];
    let aritleList = parseArticle(articleJsonData);
    aritleList.forEach(item => {
        fetchArticleContent(item, templateFile, targetDir, saveArticle);
    });
}

// 渲染内容写入 article['content]
const renderContent = (article, template) => {
    const templateContent = getTemplate(template);
    let ejs = require('ejs');
    let html = ejs.render(templateContent, article);
    article['content'] = html;
}

main(argv);