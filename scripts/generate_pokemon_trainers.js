const fs = require('fs');
const { type } = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const webp = require('webp-converter');

let things = [[], [], []];
let inputFolder = 'pictures/pokemon_trainers';
let outputFolder = 'pictures/pokemon/characters';
let outputJson = 'questions/pokemon/whos_this_character.json';

async function convertToWebp(path) {
    let ext = path.split('.').pop();
    await webp.cwebp(path, path.replace(`.${ext}`, '.webp'), "-q 80");
}

async function main() {
    for await(let file of fs.readdirSync(path.join(__dirname, inputFolder))) {
        let type = file.split('_')[0];
        switch (type) {
            case "M":
                things[0].push(file.split('_')[1].split('.')[0]);
                break;
            case "F":
                things[1].push(file.split('_')[1].split('.')[0]);
                break;
            case "G":
                things[2].push(file.split('_')[1].split('.')[0]);
                break;
        }
        let fileName = path.join(__dirname, inputFolder, file);
        if(file.split('_')[1].split('.')[1] === "webp") continue;
        await convertToWebp(fileName);
        fs.unlinkSync(fileName);
    }

    let questions = [];
    if (!fs.existsSync(path.join(__dirname, `../${outputFolder}`))) {
        fs.mkdirSync(path.join(__dirname, `../${outputFolder}`));
    }
    fs.readdirSync(path.join(__dirname, inputFolder)).forEach(file => {
        let asset = uuidv4();

        let type = 0;
        let sentence = "Quel est ce personnage ?";
        switch (file.split('_')[0]) {
            case "M":
                type = 0;
                break;
            case "F":
                type = 1;
                break;
            case "G":
                type = 2;
                break;
        }

        let fileName = file.split('_')[1].split('.')[0];
        let fileExtension = file.split('_')[1].split('.')[1];
        console.log("Process", fileName);
        fs.copyFileSync(path.join(__dirname, inputFolder, file), path.join(__dirname, `../${outputFolder}/${asset}.${fileExtension}`));

        let selectedThings = [fileName];
        let proposals = [
            {
                text: fileName,
                isAnswer: true
            }
        ]

        let proposalssss = things[type].filter(c => c !== fileName);
        for (let i = 0; i < 5; i++) {
            proposalssss = things[type].filter(c => !selectedThings.includes(c));
            let randomThing = proposalssss[Math.floor(Math.random() * proposalssss.length)];
            proposals.push(
                {
                    text: randomThing,
                    isAnswer: false
                }
            );
            selectedThings.push(randomThing);
        }

        questions.push({
            sentence: sentence,
            type: "picture",
            picture_url: `https://raw.githubusercontent.com/BanquiseDeWeils/MasterQuizz/master/${outputFolder}/${asset}.${fileExtension}`,
            proposal: [
                ...proposals
            ],
            asset: asset
        });
    });

    fs.writeFileSync(path.join(__dirname, `../${outputJson}`), JSON.stringify(questions));
}

main();