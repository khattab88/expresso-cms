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
        try {
            let ext = fileName.split(".")[1];

            /// if svg image (.svg+xml), remove {+xml} part
            ext = ext.replace("+xml", "");

            const imgSrc = `${this.folderName}${fileName}`;

            let imgDataUrl = await imageToBase64(imgSrc);
            imgDataUrl = `data:image/${ext};base64,${imgDataUrl}`;

            return imgDataUrl;
        } catch (err) {
            console.log(err);
        }
    }

    deleteImage(fileName) {
        try {
            const file = `${this.folderName}${fileName}`;

            fs.unlink(file, (err) => {
                if (err) throw err;

                // console.log(`${fileName} was deleted`);
            });
        } catch (err) {
            console.log(err);
        }
    }

    deleteAllImages() {
        try {
            const dir = fs.readdir(this.folderName, (err, files) => {
                files.forEach(file => {
                    this.deleteImage(file);
                });
            });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new ImageHandler();