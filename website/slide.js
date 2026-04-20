
let radio = document.querySelector('.manual-botao')
let count = 1

document.getElementById('radio1').checked = true

setInterval(() => {
    proximaImagem()
}, 5000)

function proximaImagem() {
    count++

    if(count > 3){
        count = 1
    }

    document.getElementById('radio'+count).checked = true
}