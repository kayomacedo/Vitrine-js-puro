// Função que vai adicionando novos produtos
async function novoProduto(listaProdutos, quantidadeProdutos,apiUrlBase) {
    var produtoSelecionado = 0;
    var container = document.getElementById("container");
    try {
        //Verificação
        const result = await fetch(apiUrlBase+'/'+listaProdutos.productId);
        
        if (!result.ok) {
            throw new Error('Erro ao buscar dados da api');
        }
        //Conversão para Json
        const data = await result.json();
        
        // Iteração para a criação dos produtos
        data.forEach(async (produto, index) => {
            
            // Quantidade
            var quantidade = document.getElementById("quantidade");
            quantidade.textContent=quantidadeProdutos+" Produtos"
            //Container principal
            var box = document.createElement("div");
            box.classList.add("box");
            var titulo = document.createElement("p");
            //Titulo
            titulo.classList.add("titulo");
            titulo.textContent = produto.items[0].nameComplete;
            // Box imagem principal
            var boxImagem = document.createElement("div"); 
            boxImagem.classList.add("boxImagem");
            var imagem = document.createElement("img");
            imagem.classList.add("imgPrincipal");
            imagem.src = produto.items[0].images[produtoSelecionado].imageUrl;
            boxImagem.appendChild(imagem);


            //Box para preços e miniaturas
            boxContent = document.createElement("div"); 
            boxContent.classList.add("boxContent");
            //miniaturas
            var miniaturas = document.createElement("div");
            miniaturas.classList.add("miniaturas");
            //preços
            var precos = document.createElement("div");
            precos.classList.add("precos");
            var preco = document.createElement("h3");
            var precoComDesconto = document.createElement("h3");
            precos.appendChild(preco);

            // Evento ao clique na miniatura
            produto.items[0].images.forEach((detalhesProduto, index) => {
                var imagemMiniatura = document.createElement("img");
                imagemMiniatura.classList.add("imgMiniatura");
                imagemMiniatura.src = detalhesProduto.imageUrl;
                imagemMiniatura.addEventListener('click', function() {
                    // atualizando do clique
                    produtoSelecionado = index;
                    imagem.src = detalhesProduto.imageUrl;
                    titulo.textContent = produto.items[0].nameComplete;
                });
                miniaturas.appendChild(imagemMiniatura);
            });
            // Preco 
            var precoInicial = produto.items[0].sellers[0].commertialOffer.ListPrice;
            var precoFormatado = precoInicial.toFixed(2).replace('.', ',');
            preco.textContent = "R$ " + precoFormatado;
            // preco desconto
            if (produto.items[0].sellers[0].commertialOffer.ListPrice != produto.items[0].sellers[0].commertialOffer.PriceWithoutDiscount){
                var precoDescontInicial = produto.items[0].sellers[0].commertialOffer.PriceWithoutDiscount;
                var precoFormatado = precoDescontInicial.toFixed(2).replace('.', ',');
                precoComDesconto.textContent = "R$ " + precoDescontInicial;
                preco.classList.add("obsoleto");
                precos.appendChild(precoComDesconto);    
            }

            precos.appendChild(precoComDesconto);

            //Botão comprar

            var botao = document.createElement("button");
            botao.classList.add("submit");
            botao.textContent = "COMPRAR";
            
            // adicionando as na box content
            boxContent.appendChild(titulo);
            boxContent.appendChild(miniaturas);
            boxContent.appendChild(precos);

            // adicionando na box principal
            box.appendChild(boxImagem);
            box.appendChild(boxContent);
            box.appendChild(botao);
            container.appendChild(box);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function main() {


    const apiUrlBase = 'https://desafio.xlow.com.br/search';
    
    // Variaveis para controle de paginas
    var productPage= 5
    var inicialCurrentProduct =0
    var pages =[]

    var endCurrentProduct = inicialCurrentProduct + productPage
    try {
        const result = await fetch(apiUrlBase);
        if (!result.ok) {
            throw new Error('Erro ao buscar dados da api');
        }
        const data = await result.json();
        const quantidadeProdutos = data.length;
        
        

         // cada pagina ficada com 5 produtos
        const protudosAtuais = data.slice(inicialCurrentProduct, endCurrentProduct);
        
        // Array para ficar com as paginas 
        var totalPaginas = Math.ceil(quantidadeProdutos / productPage);
        var paginacao = document.getElementById("pagination");

        for (let i = 1; i <= totalPaginas; i++) {
            pages.push(i)
        }

        
        pages.forEach((pagina, index) => {
            var item = document.createElement("h2")
            item.textContent=pagina

            // evento ao clicar na pagina
            item.addEventListener('click', function() {
                var boxes = document.querySelectorAll('.box');

                // Limpando 
                boxes.forEach(function(box) {
                    box.remove();
                });

                

                
                endCurrentProduct = productPage * (index+1)
                inicialCurrentProduct = endCurrentProduct - productPage
                const protudosAtuais = data.slice(inicialCurrentProduct, endCurrentProduct);
                //atualizando
                protudosAtuais.forEach(produto => {
                    novoProduto(produto,quantidadeProdutos,apiUrlBase);
                });
                
            });

            paginacao.appendChild(item)
        });
        
        
      
        

        protudosAtuais.forEach(produto => {
            novoProduto(produto,quantidadeProdutos,apiUrlBase);
        });

        
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
