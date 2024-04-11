const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const jimp = require('jimp');
const webp = require('webp-converter');

async function convertToWebp(path) {
    await webp.cwebp(path, path.replace('.png', '.webp'), "-q 80");
}

axios.get('https://tyradex.tech/api/v1/pokemon').then(async response => {

    let questions = [];

    for await (const pokemon of response.data) {
        if (pokemon.sprites.shiny === null) continue;

        let url = `/pictures/pokemon/good_shiny/gen_${pokemon.generation}/${pokemon.pokedex_id}/`;

        let assets = [uuidv4(), uuidv4(), uuidv4(), uuidv4()];
        await axios.get(pokemon.sprites.shiny, {
            responseType: 'arraybuffer'
        }).then(response => {
            fs.mkdirSync(path.join(__dirname, `..${url}/`), { recursive: true }, (err) => {
                if (err) throw err;
            });
            fs.writeFileSync(path.join(__dirname, `..${url}/${assets[0]}.png`), Buffer.from(response.data, 'binary'));
        });
        let params = [45, -45, 270]
        for (let i = 0; i < 3; i++) {
            jimp.read(path.join(__dirname, `..${url}/${assets[0]}.png`), (err, image) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("Shiny", pokemon.name.fr, i+1);
                image.color([
                    { apply: "hue", params: [params[i]] },
                ]).write(path.join(__dirname, `..${url}/${assets[i+1]}.png`), (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    convertToWebp(path.join(__dirname, `..${url}/${assets[i+1]}.png`)).then(() => {
                        fs.unlinkSync(path.join(__dirname, `..${url}/${assets[i+1]}.png`));
                    });
                });
                return;
            });
        }
        convertToWebp(path.join(__dirname, `..${url}/${assets[0]}.png`)).then(() => {
            fs.unlinkSync(path.join(__dirname, `..${url}/${assets[0]}.png`));
        });

        questions.push({
            sentence: `Quel est le vrai Pokémon Shiny parmi les suivants ?`,
            proposal: [],
            pictures: [
                {
                    url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/${url}/${assets[0]}.png`,
                    isAnswer: true
                },
                {
                    url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/${url}/${assets[1]}.png`,
                    isAnswer: false
                },
                {
                    url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/${url}/${assets[2]}.png`,
                    isAnswer: false
                },
                {
                    url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/${url}/${assets[3]}.png`,
                    isAnswer: false
                }
            ],
            type: "picture_multiple",
            asset: uuidv4()
        });
    }
    fs.writeFileSync(path.join(__dirname, '../questions/whos_the_good_shiny.json'), JSON.stringify(questions));
});