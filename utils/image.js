// import { readdir } from 'fs/promises';
const fs = require('fs');
const path = require('path');

const imageToBase64 = require('image-to-base64');

class ImageHandler {
    constructor(folderName) {
        this.folderName = folderName || path.join(__dirname, '../public/img/uploads/');

        // console.log(this.folderName);
    }

    async saveImageAsBase64(fileName) {
        const ext = fileName.split(".")[1];
        const imgSrc = `${this.folderName}${fileName}`;

        let imgDataUrl = await imageToBase64(imgSrc);
        imgDataUrl = `data:image/${ext};base64,${imgDataUrl}`;

        return imgDataUrl;
    }

    deleteImage(fileName) {
        const file = `${this.folderName}${fileName}`;

        fs.unlink(file, (err) => {
            if (err) throw err;

            console.log(`${fileName} was deleted`);
        });
    }

    deleteAllImages() {
        const dir = fs.readdir(this.folderName, (err, files) => {
            files.forEach(file => {
                this.deleteImage(file);
            });
        });
    }
}

module.exports = new ImageHandler();