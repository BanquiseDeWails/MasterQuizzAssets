
const axios = require('axios');
const fs = require('fs');
const webp = require('webp-converter');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

let questions = [];

const ZARBS = ['a', 'b', 'c', 'd', 'e', 'exclamation', 'f', 'g', 'h', 'i', 'question', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
ZARBS.forEach(zarbi => {
    let name = zarbi;
    let asset = uuidv4();
    console.log("Processing zarbi " + name + "...");

    let proposals = [
        {
            text: name == 'exclamation' ? '!' : (name == 'question' ? '?' : name.toUpperCase()),
            isAnswer: true
        },
    ];
    let selectedZarbi = [name];

    let zarbis = ZARBS.filter(f => f.split('.')[0] !== name);
    for (let i = 0; i < 5; i++) {
        zarbis =  ZARBS.filter(f => !selectedZarbi.includes(f));
        let randomZarbi = zarbis[Math.floor(Math.random() * (zarbis.length - 1))];
        proposals.push(
            {
                text: randomZarbi == 'exclamation' ? '!' : (randomZarbi == 'question' ? '?' : randomZarbi.toUpperCase()),
                isAnswer: false
            }
        );
        selectedZarbi.push(randomZarbi);
    }

    questions.push(
        {
            sentence: "Quel est ce Zarbi ?",
            type: "picture",
            picture_url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/201-${name}.png`,
            proposal: [
                ...proposals
            ],
            asset: asset
        }
    );
});

fs.writeFileSync('questions_zarbi.json', JSON.stringify(questions));