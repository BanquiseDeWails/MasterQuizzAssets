const fs = require('fs');
const { type } = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

let celebrities = [[], [], []];
fs.readdirSync(path.join(__dirname, 'pictures/celebrity_internet')).forEach(file => {
    let type = file.split('_')[0];
    switch(type) {
        case "M":
            celebrities[0].push(file.split('_')[1].split('.')[0]);
            break;
        case "F":
            celebrities[1].push(file.split('_')[1].split('.')[0]);
            break;
        case "G":
            celebrities[2].push(file.split('_')[1].split('.')[0]);
            break;
    }
});

let questions = [];
fs.readdirSync(path.join(__dirname, 'pictures/celebrity_internet')).forEach(file => {
    let asset = uuidv4();

    let type = 0;
    let sentence = "";
    switch(file.split('_')[0]) {
        case "M":
            type = 0;
            sentence = `Quel est le nom de cet influenceur ?`;
            break;
        case "F":
            type = 1;
            sentence = `Quel est le nom de cette influenceuse ?`;
            break;
        case "G":
            type = 2;
            sentence = `Quel est le nom de ce groupe d'influenceur ?`;
            break;
    }

    let fileName = file.split('_')[1].split('.')[0];
    let fileExtension = file.split('_')[1].split('.')[1];
    console.log("Process", fileName);
    fs.copyFileSync(path.join(__dirname, 'pictures/celebrity_internet', file), path.join(__dirname, `../pictures/internet_celebrity/${asset}.${fileExtension}`));

    let selectedCelebrities = [fileName];
    let proposals = [
        {
            text: fileName,
            isAnswer: true
        }
    ]

    let proposalssss = celebrities[type].filter(c => c !== fileName);
    for(let i = 0; i < 5; i++) {
        proposalssss = celebrities[type].filter(c => !selectedCelebrities.includes(c));
        let randomCelebrity = proposalssss[Math.floor(Math.random() * proposalssss.length)];
        proposals.push(
            {
                text: randomCelebrity,
                isAnswer: false
            }
        );
        selectedCelebrities.push(randomCelebrity);
    }

    questions.push({
        sentence: sentence,
        type: "picture",
        picture_url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/pictures/internet_celebrity/${asset}.${fileExtension}`,
        proposal: [
            ...proposals
        ],
        asset: asset
    });
});

fs.writeFileSync(path.join(__dirname, '../questions/whos_this_internet_celebrity.json'), JSON.stringify(questions));