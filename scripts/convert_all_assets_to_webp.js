const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const webp = require('webp-converter');


async function convertToWebp(path) {
    let ext = path.split('.').pop();
    await webp.cwebp(path, path.replace(`.${ext}`, '.webp'), "-q 80");
}

function recursiveReadDirSync(dir, func) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            recursiveReadDirSync(filePath, func);
        }
        else {
            func(filePath);
        }
    });
}

function convert_all_assets_to_webp() {
    let assets = path.join(__dirname, '../pictures');
    recursiveReadDirSync(assets, async (file) => {
        if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            console.log(`Converting ${file} to webp`);
            await convertToWebp(file);
            fs.unlinkSync(file);
        }
    });
}

exports.convert_all_assets_to_webp = convert_all_assets_to_webp;