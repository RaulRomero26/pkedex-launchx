

const fetchPokemon = () => {
    var audio = document.getElementById("myaudio");
    audio.volume = 0.01;
    const pokeNameInput = document.getElementById("pokeName");
    let pokeName = pokeNameInput.value;
    pokeName = pokeName.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokeName}`;
    fetch(url).then((res) => {
        if (res.status != "200") {
            pokeImage('./media/images/undefined.png')
            pokeInfo('','','','','','')
            pokeDetails("I don't have any info about this pokemon");
            speakDesc("I don't have any info about this pokemon");
        }
        else {
            return res.json();
        }
    }).then((data) => {
        if (data) {
            let pokeImg = data.sprites.front_default;
            let name = data.name;
            let number = data.id;
            let moves = data.moves;
            let stats = [{}];
            let types = [];
            for (tipo of data.types){
                types.push(tipo.type.name)
            }
            for ( stat of data.stats){
                nueva = new Object({
                    base_stat : stat.base_stat,
                    name: stat.stat.name,
                })
                stats.push(nueva);
            }
            stats.shift();
            const urlinfo = `https://pokeapi.co/api/v2/pokemon-species/${number}`;
            fetch(urlinfo).then((details) =>{
                let info;
                if(details.status != "200"){
                    pokeDetails("I don't have any info about this pokemon");
                    speakDesc(info);
                }
                else{
                    return details.json();
                }
            }).then((details) => {
                if(details){
                    en_flavor = []
                    for(let flavor of details.flavor_text_entries){

                        if(flavor.language.name == "en"){
                            en_flavor.push(flavor.flavor_text)
                        }
                    }
                    let randomIndex = Math.floor(Math.random() * en_flavor.length);
                    info = `${en_flavor[randomIndex]}`
                   
                    pokeDetails(info);
                    speakDesc(info);
                } else{
                    info = `I don't have any info of this pokemon`;
                    pokeDetails(info);
                    speakDesc(info);
                }
            }) 
            pokeInfo(name,number,types,stats,moves);
            pokeImage(pokeImg);
        }
    });
}

const pokeInfo = (nombre, numero, tipos, caracteristicas, movimientos) => {
    const name = document.getElementById("name");
    const type = document.getElementById("types-screen");
    const number = document.getElementById("number");
    const stats = document.getElementById("stats-screen");
    const moves = document.getElementById("moves-screen")
    name.innerHTML ='';
    name.innerHTML += `${nombre}`;
    number.innerHTML = '';
    number.innerHTML = `${numero}`
    stats.innerHTML = '';
    type.innerHTML = '';
    moves.innerHTML = '';
    console.log(tipos)
    for(let tipo of tipos){
        type.innerHTML += `<span class="name type ${tipo}">${tipo}</span>`
    }
    for (let stat of caracteristicas){
        stats.innerHTML += `<p class="name stat">${stat.name}<span class="number">${stat.base_stat}</span></p>`
    }
    for (let movimento of movimientos){
      moves.innerHTML += `<span class="name stat">${ movimento.move.name.replace('-', ' ') }, </span>`
    }
}

const pokeDetails = (details) => {
    const detalles = document.getElementById("detalles")
    detalles.innerHTML = '';
    detalles.innerHTML += `${details}`
}

const pokeImage = (url) => {
    const pokePhoto = document.getElementById("pokeImg");
    pokePhoto.src = url;
}

const speakDesc = (details => {
    let speech = new SpeechSynthesisUtterance();

    speech.lang = "en-US";
    speech.text = details;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 0.5;                

    window.speechSynthesis.speak(speech);
})