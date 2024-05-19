// Função que adiciona novos produtos
async function novoProduto(listaProdutos, quantidadeProdutos, apiUrlBase) {
    var produtoSelecionado = 0;
    var container = document.getElementById("container");
    try {
        // Busca os dados da API
        const result = await fetch(apiUrlBase + '/' + listaProdutos.productId);
        
        if (!result.ok) {
            throw new Error('Erro ao buscar dados da API');
        }
        // Converte para JSON
        const data = await result.json();
        
        // Iteração para criar os produtos
        data.forEach(async (produto, index) => {
            
            // Quantidade de produtos
            var quantidade = document.getElementById("quantity");
            quantidade.textContent = quantidadeProdutos + " Produtos";
            
            // Container principal
            var box = document.createElement("div");
            box.classList.add("box");
            
            // Título
            var titulo = document.createElement("p");
            titulo.classList.add("title");
            titulo.textContent = produto.items[0].nameComplete;
            
            // Box da imagem principal
            var boxImagem = document.createElement("div");
            boxImagem.classList.add("boxImage");
            var imagem = document.createElement("img");
            imagem.classList.add("mainImage");
            imagem.src = produto.items[0].images[produtoSelecionado].imageUrl;
            boxImagem.appendChild(imagem);

            // Box para preços e miniaturas
            var boxContent = document.createElement("div");
            boxContent.classList.add("boxContent");
            
            // Miniaturas
            var miniaturas = document.createElement("div");
            miniaturas.classList.add("thumbnails");
            
            // Preços
            var precos = document.createElement("div");
            precos.classList.add("prices");
            var preco = document.createElement("h3");
            var precoComDesconto = document.createElement("h3");
            precos.appendChild(preco);

            // Evento ao clicar na miniatura
            produto.items[0].images.forEach((detalhesProduto, index) => {
                var imagemMiniatura = document.createElement("img");
                imagemMiniatura.classList.add("thumbnailImg");
                imagemMiniatura.src = detalhesProduto.imageUrl;
                imagemMiniatura.addEventListener('click', function() {
                    // Atualiza ao clicar
                    produtoSelecionado = index;
                    imagem.src = detalhesProduto.imageUrl;
                    titulo.textContent = produto.items[0].nameComplete;
                });
                miniaturas.appendChild(imagemMiniatura);
            });

            // Preço
            var precoInicial = produto.items[0].sellers[0].commertialOffer.ListPrice;
            var precoFormatado = precoInicial.toFixed(2).replace('.', ',');
            preco.textContent = "R$ " + precoFormatado;
            
            // Preço com desconto
            if (produto.items[0].sellers[0].commertialOffer.ListPrice != produto.items[0].sellers[0].commertialOffer.PriceWithoutDiscount){
                var precoDescontoInicial = produto.items[0].sellers[0].commertialOffer.PriceWithoutDiscount;
                var precoFormatado = precoDescontoInicial.toFixed(2).replace('.', ',');
                precoComDesconto.textContent = "R$ " + precoDescontoInicial;
                preco.classList.add("obsolete");
                precos.appendChild(precoComDesconto);    
            }

            precos.appendChild(precoComDesconto);

            // Botão comprar
            var botao = document.createElement("button");
            botao.classList.add("submit");
            botao.textContent = "COMPRAR";
            
            // Adicionando elementos no boxContent
            boxContent.appendChild(titulo);
            boxContent.appendChild(miniaturas);
            boxContent.appendChild(precos);

            // Adicionando no box principal
            box.appendChild(boxImagem);
            box.appendChild(boxContent);
            box.appendChild(botao);
            container.appendChild(box);
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function main() {
    const apiUrlBase = 'https://desafio.xlow.com.br/search';
    
    // Variáveis para controle de paginação
    var produtosPorPagina = 5;
    var produtoInicialAtual = 0;
    var paginas = [];

    var produtoFinalAtual = produtoInicialAtual + produtosPorPagina;
    try {
        const result = await fetch(apiUrlBase);
        if (!result.ok) {
            throw new Error('Erro ao buscar dados da API');
        }
        const data = await result.json();
        const quantidadeProdutos = data.length;
        
        // Produtos atuais em exibição
        const produtosAtuais = data.slice(produtoInicialAtual, produtoFinalAtual);
        
        // Array para armazenar as páginas
        var totalPaginas = Math.ceil(quantidadeProdutos / produtosPorPagina);
        var paginacao = document.getElementById("pagination");

        for (let i = 1; i <= totalPaginas; i++) {
            paginas.push(i);
        }

        paginas.forEach((pagina, index) => {
            var item = document.createElement("h2");
            item.textContent = pagina;

            // Evento ao clicar na página
            item.addEventListener('click', function() {
                var caixas = document.querySelectorAll('.box');

                // Limpa produtos existentes
                caixas.forEach(function(caixa) {
                    caixa.remove();
                });

                // Atualiza página atual
                produtoFinalAtual = produtosPorPagina * (index + 1);
                produtoInicialAtual = produtoFinalAtual - produtosPorPagina;
                const produtosAtuais = data.slice(produtoInicialAtual, produtoFinalAtual);
                
                // Atualiza exibição
                produtosAtuais.forEach(produto => {
                    novoProduto(produto, quantidadeProdutos, apiUrlBase);
                });
                
            });

            paginacao.appendChild(item);
        });
        
        // Exibe os produtos iniciais
        produtosAtuais.forEach(produto => {
            novoProduto(produto, quantidadeProdutos, apiUrlBase);
        });
        
    } catch (error) {
        console.error('Erro:', error);
    }
}

main();
