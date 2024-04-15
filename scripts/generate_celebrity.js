const fs = require('fs');
const { type } = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { convert_all_assets_to_webp } = require('./convert_all_assets_to_webp');

let celebritiesThemes = [
    { code: 'C', name: 'cinema', male: {sentence: "Qui est-ce  ?", celebrities: [] }, female: {sentence: "Qui est-ce  ?", celebrities: []}},
    { code: 'S', name: 'sport', male: {sentence: "Qui est-ce  ?", celebrities: [] }, female: {sentence: "", celebrities: []}},
    { code: 'H', name: 'humoriste', male: {sentence: "Qui est-ce  ?", celebrities: [] }, female: {sentence: "Qui est-ce  ?", celebrities: []}},
    { code: 'M', name: 'music', male: {sentence: "Qui est-ce  ?", celebrities: [] }, female: {sentence: "Qui est-ce  ?", celebrities: []}, group: {sentence: "Qui est-ce  ?", celebrities: []}},
    { code: 'P', name: 'politic', male: {sentence: "Qui est-ce  ?", celebrities: [] }, female: {sentence: "Qui est-ce  ?", celebrities: []}},
    { code: 'T', name: 'television', male: {sentence: "Qui est-ce  ?", celebrities: [] }, female: {sentence: "Qui est-ce  ?", celebrities: []}},
    { code: 'I', name: 'internet', male: {sentence: "Qui est-ce  ?", celebrities: [] }, female: {sentence: "Qui est-ce  ?", celebrities: []}},
    { code: 'O', name: 'other', male: {sentence: "Qui est-ce  ?", celebrities: [] }, female: {sentence: "Qui est-ce  ?", celebrities: []}},
];
fs.readdirSync(path.join(__dirname, 'pictures/celebrity')).forEach(file => {
    let infos = file.split('_');
    let code = infos[0];
    let genre = infos[1] == 'M' ? 'male' : (infos[1] == 'F' ? 'female' : 'group');
    let fileInfo = infos[2].split('.');
    let ext = fileInfo.pop(); // Remove extension
    let name = fileInfo.join('.');
    
    let celebrity = {
        asset: uuidv4(),
        name: name,
        genre: genre,
        image: file,
        ext: ext
    };

    celebritiesThemes.find(c => c.code === code)[genre].celebrities.push(celebrity);
});

celebritiesThemes.forEach(theme => {
    let questions = [];
    fs.mkdirSync(path.join(__dirname, `../pictures/celebrity/${theme.name}/`), { recursive: true }, (err) => {
        if (err) throw err;
    });
    ['male', 'female', 'group'].forEach(genre => {
        if(!theme[genre]) return;
        let sentence = theme[genre].sentence;
        let celebrities = theme[genre].celebrities;
        celebrities.forEach(celebrity => {
            fs.copyFileSync(path.join(__dirname, 'pictures/celebrity', celebrity.image), path.join(__dirname, `../pictures/celebrity/${theme.name}/${celebrity.asset}.${celebrity.ext}`));
            let selectedCelebrities = [celebrity.asset];
            let proposals = [
                {
                    text: celebrity.name,
                    isAnswer: true
                }
            ]
    
            for (let i = 0; i < 5; i++) {
                let proposalssss = celebrities.filter(c => !selectedCelebrities.includes(c.asset));
                let randomCelebrity = proposalssss[Math.floor(Math.random() * proposalssss.length)];
                if(!randomCelebrity) break;
                proposals.push(
                    {
                        text: randomCelebrity.name,
                        isAnswer: false
                    }
                );
                selectedCelebrities.push(randomCelebrity.asset);
            }
    
            questions.push({
                sentence: sentence,
                type: "picture",
                picture_url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/pictures/celebrity/${theme.name}/${celebrity.asset}.webp`,
                proposal: [
                    ...proposals
                ],
                asset: celebrity.asset
            });
        });
    });
    fs.writeFileSync(path.join(__dirname, `../questions/who_is_this/whos_this_${theme.name}_celebrity.json`), JSON.stringify(questions));
});

convert_all_assets_to_webp();