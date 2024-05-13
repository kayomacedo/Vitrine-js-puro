const apiUrl = 'https://desafio.xlow.com.br/search';

async function main() {
    try {
        const result = await fetch(apiUrl);
        if (!result.ok) {
            throw new Error('Erro ao buscar dados da api');
        }
        const data = await result.json();
        data.forEach(item => {
            add_product(item,data.length)
        });
    } catch (error) {
        console.error('Error:', error);
    }


    
}


main()

async function add_product(item, quantidade){


    var nova_quantidade = document.querySelector('.quantidade');
    nova_quantidade.textContent = quantidade + " produtos";

    // Criar um novo elemento div para o novo box-produto
    var novoBoxProduto = document.createElement("div");
    novoBoxProduto.classList.add("box-produto");

    // Criar os elementos internos do novo box-produto
    var novaImagem = document.createElement("img");
    novaImagem.classList.add("image");
    novaImagem.src = item.image;

    var novoTitulo = document.createElement("div");
    novoTitulo.classList.add("titulo");
    novoTitulo.textContent = item.productName;

    var miniaturas = document.createElement("div");
    miniaturas.classList.add('miniaturas')

    const productDetailsResponse = await fetch(`https://desafio.xlow.com.br/search/${item.productId}`);
    const productDetails = await productDetailsResponse.json();

    console.log(productDetails.items[0])

    if (Array.isArray(productDetails.image)) {
        item.image.forEach(function(imageUrl) {
            var miniaturaImagem = document.createElement("img");
            miniaturaImagem.classList.add("miniatura");
            miniaturaImagem.src = imageUrl;
            miniaturas.appendChild(miniaturaImagem);
        });
    }else{
        var miniaturaImagem = document.createElement("img");
        miniaturaImagem.classList.add("miniatura");
        miniaturaImagem.src = item.image;
        miniaturas.appendChild(miniaturaImagem) 
    }




    if(item.bestPrice != item.listPrice){
        var precoAntigo = document.createElement("div");
        precoAntigo.classList.add("preco-antigo");
        var precoCentavos = item.listPrice;     
        var precoReais = precoCentavos / 100;
        var precoFormatado = precoReais.toFixed(2).replace('.', ',');
        precoAntigo.textContent = "R$ " + precoFormatado;
    }
    

    var novoPreco = document.createElement("div");
    novoPreco.classList.add("preco");
    var precoCentavos = item.bestPrice;     
    var precoReais = precoCentavos / 100;
    var precoFormatado = precoReais.toFixed(2).replace('.', ',');
    novoPreco.textContent = "R$ " + precoFormatado;

    var button = document.createElement("button");
    button.classList.add("submit");
    button.textContent = "COMPRAR";


    try {
         // Adicionar os elementos internos ao novo box-produto
            novoBoxProduto.appendChild(novaImagem);
            novoBoxProduto.appendChild(novoTitulo);
            novoBoxProduto.appendChild(miniaturas)
            novoBoxProduto.appendChild(precoAntigo);
            novoBoxProduto.appendChild(novoPreco);
            novoBoxProduto.appendChild(button);

    } catch (error) {
        // Adicionar os elementos internos ao novo box-produto
            novoBoxProduto.appendChild(novaImagem);
            novoBoxProduto.appendChild(novoTitulo);
            novoBoxProduto.appendChild(miniaturas)
            novoBoxProduto.appendChild(novoPreco);
            novoBoxProduto.appendChild(button);
    }


    

    // Adicionar o novo box-produto à div .minha-vitrine
    var minhaVitrine = document.querySelector(".minha-vitrine");
    minhaVitrine.appendChild(novoBoxProduto);
}



