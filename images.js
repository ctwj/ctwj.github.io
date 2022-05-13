#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const request = require('request');

const targetPath = './source/images/';
const dataDir = './source/_posts/';

let files = [];
const readDir = (url) => {
    const dirInfo = fs.readdirSync(url);
  
    dirInfo.map(item=>{
      const location = path.join(url, item);
      const info = fs.statSync(location);
      
      if(info.isDirectory()){
        readDir(location);
      }else{
        // console.log(`file:${location}`);
        files.push(location);
      }
    });
  }

const getFile = (template) => {
    try {
        const data = fs.readFileSync(template, 'utf8');
        return data;
    } catch (err) {
        console.log(`Error reading file from disk: ${err}`);
    }
}

const reqeustAsyn = (url) => {
    console.log('url', url);
    return new Promise((resolve, reject) => {
        request(url, {encoding: 'binary'}, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    });
}

const writeFileAsync = (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, 'binary', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    });
}

const fetchAndSaveImage = (file, image) => {
    const pathArr = image.split('/');
    const imageName = pathArr[pathArr.length - 1];
    const imagePath = `${targetPath}${imageName}`;
    // 1, 下载回来所有图片
    // if (!fs.existsSync(imagePath)) {
    //     console.log('fetch ',image );
    //     request(image).pipe(fs.createWriteStream(`${targetPath}${imageName}`));
    // }
    // 2, 更新文件内容
    // if (fs.existsSync(imagePath)) {
    //     console.log('update ',file );
    //     let data = getFile(file);
    //     let content = data.replace(image, `/images/${imageName}`)
    //     // request(image).pipe(fs.createWriteStream(`${targetPath}${imageName}`));
    //     fs.writeFile(file, content, {flag: 'w'}, function (err) {
    //         if(err) {
    //          console.error(err);
    //          } else {
    //             console.log('写入成功', file);
    //          }
    //      });
    // }

}

const ariticleImageGet = async (file) => {
    return new Promise(async (resolve, reject) => {
        // console.log(`file:${file}`);
        let content = getFile(file);
        // src="http://shop.img.huishuaka.com/imgs/windows/2017/5/15/4f4eee58-d6e7-4a6e-a19b-a9670ca6.gif"
        const match = content.match(/src=\"(.*?)\"/);
        if (!match || !match[1]) {
            reject(file);
        }
        if (match && match[1]) {
            // console.log(match[1]);
            let image = match[1];
            const pathArr = image.split('/');
            const imageName = pathArr[pathArr.length - 1];
            const imagePath = `${targetPath}${imageName}`;
            if (fs.existsSync(imagePath)) {
                resolve();
            } else {
                let data = await reqeustAsyn(image).catch(error => {
                    console.log('request', image, error)
                });
                await writeFileAsync(imagePath, data);
                console.log('save file', imagePath);
                resolve();
            }
            // resolve();
        }
    });
}



// enter
const main = () => {
    readDir(dataDir);
    // console.log(files);
    let arr = [];
    files.forEach(async file => {
        await ariticleImageGet(file).catch(error => {
            console.log(error);
        });
    });
    // ariticleImageGet(files[10]).catch(error => {
    //     console.log(error);
    // });
}

main();