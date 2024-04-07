
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const jimp = require('jimp');

const pokemons = require('./pokemons.json');

axios.get('https://tyradex.tech/api/v1/pokemon').then(async response => {
    let questions_pokemon_image = [];
    let questions_pokemon_sound = [];
    for await (const pokemon of response.data) {
        if (pokemon.pokedex_id == 0) continue;
        console.log("Processing " + pokemon.name.fr);
        let asset = uuidv4();

        // Download the regular sprite
        await axios.get(pokemon.sprites.regular, {
            responseType: 'arraybuffer'
        }).then(response => {
            fs.writeFileSync(path.join(__dirname, `assets/pictures/pokemon/regular/${asset}.png`), Buffer.from(response.data, 'binary'));
        });

        // Set brightness to 0 (hidden sprite)
        jimp.read(path.join(__dirname, `assets/pictures/pokemon/regular/${asset}.png`), (err, image) => {
            if (err) {
                console.error(err);
                return;
            }
            return image.brightness(-1).write(path.join(__dirname, `assets/pictures/pokemon/hidden/${asset}.png`));
        });

        // Download the sound of the pokemon
        await axios.get(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.pokedex_id}.ogg`, {
            responseType: 'arraybuffer'
        }).then(response => {
            fs.writeFileSync(path.join(__dirname, `assets/sounds/pokemon_cries/${asset}.ogg`), Buffer.from(response.data, 'binary'));
        });



        // Generate the Image question
        let proposals = [
            {
                text: pokemon.name.fr,
                isAnswer: true
            },
        ];
        let selectedPokemon = [pokemon.name.fr];
        let pokemonssss = pokemons.filter(p => p.name !== pokemon.name.fr);
        for (let i = 0; i < 5; i++) {
            pokemonssss = pokemons.filter(p => !selectedPokemon.includes(p.name));
            let randomPokemon = pokemonssss[Math.floor(Math.random() * pokemonssss.length)];
            proposals.push(
                {
                    text: randomPokemon.name,
                    isAnswer: false
                }
            );
            selectedPokemon.push(randomPokemon.name);
        }

        questions_pokemon_image.push(
            {
                sentence: "Quel est ce pokémon ?",
                type: "picture",
                picture_url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/pictures/pokemon/hidden/${asset}.png`,
                picture_reveal_url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/pictures/pokemon/regular/${asset}.png`,
                sound_reveal_url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/sounds/pokemon_cries/${asset}.ogg`,
                proposal: [
                    ...proposals
                ],
                asset: asset
            }
        );


        // Generate the Sound question
        proposals = [
            {
                text: pokemon.name.fr,
                isAnswer: true
            },
        ];
        selectedPokemon = [pokemon.name.fr];

        pokemonssss = pokemons.filter(p => p.name !== pokemon.name.fr);
        for (let i = 0; i < 5; i++) {
            pokemonssss = pokemons.filter(p => !selectedPokemon.includes(p.name));
            let randomPokemon = pokemonssss[Math.floor(Math.random() * pokemonssss.length)];
            proposals.push(
                {
                    text: randomPokemon.name,
                    isAnswer: false
                }
            );
            selectedPokemon.push(randomPokemon.name);
        }

        questions_pokemon_sound.push(
            {
                sentence: "A quel pokémon appartient ce cri ?",
                type: "sound",
                sound_url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/sounds/pokemon_cries/${asset}.ogg`,
                picture_reveal_url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/pictures/pokemon/regular/${asset}.png`,
                sound_reveal_url: `https://raw.githubusercontent.com/NiixoZ/MasterQuizz/master/sounds/pokemon_cries/${asset}.ogg`,
                proposal: [
                    ...proposals
                ],
                asset: asset
            }
        );
    }
    fs.writeFileSync('assets/questions/whos_that_pokemon_image.json', JSON.stringify(questions_pokemon_image));
    fs.writeFileSync('assets/questions/whos_that_pokemon_sound.json', JSON.stringify(questions_pokemon_sound));
});