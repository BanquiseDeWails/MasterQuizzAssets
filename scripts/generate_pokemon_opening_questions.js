const fs = require('fs');
const { type } = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

let questions = [];
fs.readdirSync(path.join(__dirname, 'sounds')).forEach(file => {
    if(file.endsWith('.mp3')) {
        let asset = uuidv4();
        
        let fileName = file.split('.')[0];
        fs.copyFileSync(path.join(__dirname, 'sounds', file), path.join(__dirname , `../sounds/pokemon/series/${asset}.mp3`));
        fs.copyFileSync(path.join(__dirname, 'sounds', fileName) + '.png', path.join(__dirname, `../pictures/pokemon/series/${asset}.png`));

        questions.push({
            sentence: `De quel saison provient ce générique ?`,
            type: "sound",
            sound_url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/sounds/pokemon/series/${asset}.mp3`,
            picture_reveal_url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/pictures/pokemon/series/${asset}.png`,
            proposal: [
                {
                    text: fileName,
                    isAnswer: true
                }
            ],
            asset: asset
        });
    }
});

fs.writeFileSync(path.join(__dirname, '../questions/whats_this_opening.json'), JSON.stringify(questions));