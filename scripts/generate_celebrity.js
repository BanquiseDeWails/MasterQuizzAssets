const fs = require('fs');
const { type } = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

let celebritiesThemes = [
    { code: 'C', name: 'Cinéma', male: {sentence: "", celebrities: [] }, female: {sentence: "", celebrities: []}},
    { code: 'S', name: 'Sport', male: {sentence: "", celebrities: [] }, female: {sentence: "", celebrities: []}},
    { code: 'H', name: 'Humoriste', male: {sentence: "", celebrities: [] }, female: {sentence: "", celebrities: []}},
    { code: 'M', name: 'Musique', male: {sentence: "", celebrities: [] }, female: {sentence: "", celebrities: []}},
    { code: 'P', name: 'Politique', male: {sentence: "", celebrities: [] }, female: {sentence: "", celebrities: []}},
    { code: 'T', name: 'Télévision', male: {sentence: "", celebrities: [] }, female: {sentence: "", celebrities: []}},
    { code: 'I', name: 'Internet', male: {sentence: "", celebrities: [] }, female: {sentence: "", celebrities: []}},
    { code: 'A', name: 'Autre', male: {sentence: "Qui est-ce  ?", celebrities: [] }, female: {sentence: "Qui est-ce  ?", celebrities: []}},
];
fs.readdirSync(path.join(__dirname, 'pictures/celebrity')).forEach(file => {
    let infos = file.split('_');
    let code = infos[0];
    let genre = infos[1] == 'M' ? 'male' : 'female';
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

let questions = [];
celebritiesThemes.forEach(theme => {
    ['male', 'female'].forEach(genre => {
        let sentence = theme[genre].sentence;
        let celebrities = theme[genre].celebrities;
        celebrities.forEach(celebrity => {
            fs.copyFileSync(path.join(__dirname, 'pictures/celebrity', celebrity.image), path.join(__dirname, `../pictures/celebrity/${celebrity.asset}.${celebrity.ext}`));
            let selectedCelebrities = [celebrity.asset];
            let proposals = [
                {
                    text: celebrity.name,
                    isAnswer: true
                }
            ]
    
            for (let i = 0; i < 5; i++) {
                let proposalssss = celebrities.map(c => c.name).filter(c => !selectedCelebrities.includes(c));
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
                picture_url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/pictures/celebrity/${celebrity.asset}.${celebrity.ext}`,
                proposal: [
                    ...proposals
                ],
                asset: celebrity.asset
            });
        });
    });
});
fs.writeFileSync(path.join(__dirname, '../questions/whos_this_celebrity.json'), JSON.stringify(questions));