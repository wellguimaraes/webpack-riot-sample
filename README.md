<h2>Intro</h2>

<p>
    De maneira simples, podemos definir o <strong>webpack</strong> como um empacotador de módulos (javascript e cia):
    pega um asset aqui e outro ali e os transforma em algo que você possa rodar. Parece algo trivial,
    mas pode ser trabalhoso. É aí que entra o <strong>webpack</strong> pra facilitar <strike>um pouco</strike> bastante a vida.
</p>
<p>
    Se você já conhece/usa o <strong>Browserify</strong>, deve me perguntar por quê trocaria seis por meia dúzia.
    Bom, embora o <strong>webpack</strong> seja “vendido” como um simples <em>bundler</em>, dois
    pontos o tornam bem mais do que meia dúzia:
</p>
<ol>
    <li>
        na maioria dos casos podemos abrir mão das ferramentas de automação de tarefas (Grunt/Gulp)
        utilizando <em>loaders</em>, que fazem o pré-processamento de arquivos “diferentes”
        (coffee, es6, ts, sass, less, jade, imagens, etc) e os tornam “utilizáveis” com um banal <em>require</em>;
    </li>
    <li>
        em aplicações maiores, onde as coisas começam a ficar mais pesadas, o <strong>webpack</strong>
        traz a possibilidade de carregar dependências sob demanda (<em>code splitting</em>), sem precisar
        colocar tudo num grande e pesado <em>bundle</em>.
    </li>
</ol>


<h2>Quero ver na prática!</h2>

<p>
    Para clarear o entendimento, vamos construir um exemplo de uso do webpack utilizando Riot (custom tags) e Sass.
</p>

<p>
    A estrutura do nosso exemplo vai ficar assim:
</p>

<pre>
    webpack-sample/
        app/
            tags/
        public/
            bundles/
</pre>

<p>
    Com a estrutura pronta, crie o arquivo <em>/public/main.html</em>
</p>

<pre>
    &lt;!DOCTYPE html&gt;
    &lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;Webpack sample&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;my-app&gt;&lt;/my-app&gt;
        &lt;script src="bundles/main/bundle.js"&gt;&lt;/script&gt;
    &lt;/body&gt;
    &lt;/html&gt;
</pre>

<p>
    Você deve ter observado que foi usada a tag <strong>my-app</strong>, que é na verdade uma <em>custom tag</em>
    que iremos criar mais a frente. Por enquanto, ela simplesmente não vai ter efeito.
</p>
<p>
    Agora crie o arquivo <em>app/main.js</em>, que será o ponto de partida da aplicação.
</p>
<pre>
    document.write('deu certo!');
</pre>
<p>
    Agora que já temos alguns arquivos para experimentar o <strong>webpack</strong>, vamos aos preparativos.
    Inicialize o npm no diretório raiz e instale os pacotes que iremos utilizar neste exemplo:
</p>
<pre>
    npm init
    npm install -g webpack
    npm install --save-dev webpack
    npm install --save-dev riot riotjs-loader
    npm install --save-dev css-loader style-loader node-sass sass-loader
</pre>
<p>
    O <strong>webpack</strong> pode ser utilizado sem um arquivo de configuração, mas vamos pular esse passo basicão e cair dentro
    do jeito legal de usá-lo. Crie na raiz do projeto o arquivo <em>webpack.config.js</em>.
    Vamos começar com a seguinte configuração:
</p>

<pre>
    module.exports = {
        entry: {
            main: './app/main.js'
        },
        output: {
            path: __dirname + '/public/bundles',
            filename: "[name]/bundle.js"
        }
    }
</pre>

<p>
    Criado o arquivo de configuração, podemos então rodar o webpack no diretório raiz com o comando:
</p>

<pre>
    webpack
</pre>

<p>
    Observe que o bundle foi gerado, e agora está no diretório /public/bundles/main, conforme havíamos configurado.
    Ao abrir o arquivo /public/main.html agora, veremos um "deu certo" na tela, obra do main.js.
</p>
<p>
    Bom, até aqui, nada de mais. Seguimos então para os passos mais legais. Criemos a tag <strong>my-app</strong> com o
    arquivo <em>/app/tags/my-app.tag</em>:
</p>
<p>
    <small>Obs.: a sintaxe de custom tags do Riot é bem simples de entender, e para este exemplo, não é preciso
        dominá-la. Mas caso queira conhecer melhor antes de continuar,
        dê uma olhada no <a href="http://riotjs.com/guide/">Riot guide</a>.
    </small>
</p>
<pre>
    &lt;my-app&gt;
        &lt;div&gt;
            Hello, I'm a custom tag.
            &lt;button onclick={toggleLipsum} class={active: lipsumVisible}&gt;More info&lt;/button&gt;
            &lt;lipsum if={lipsumVisible}&gt;&lt;/lipsum&gt;
        &lt;/div&gt;

        &lt;style&gt;{styles}&lt;/style&gt;

        &lt;script&gt;
            // Aqui carregamos um arquivo SASS
            this.styles = require('./my-app.scss');
            this.lipsumVisible = false;

            this.toggleLipsum = function() {
                this.lipsumVisible = !this.lipsumVisible;

                if (this.lipsumVisible)
                    // A tag &lt;lipsum&gt; será carregada sob demanda
                    // somente quando for necessária
                    require(['./lipsum.tag'], function() {
                        window.riot.mount("lipsum");
                    });
            };
        &lt;/script&gt;
    &lt;/my-app&gt;
</pre>
<p>
    Observe que dentro da tag <strong>my-app</strong> utilizamos a custom tag <strong>lipsum</strong> e um botão cujo
    clique executa a função <em>toggleLipsum</em> para habilitar/desabilitar a exibiçao da tag <strong>lipsum</strong>.
    Sabendo que a tag <strong>lipsum</strong> não é necessária no momento em que a tag <strong>my-app</strong> é
    renderizada (já que o comportamento padrão é ocultá-la), podemos optar por carregá-la somente quando houver
    demanda. Para isso, como você pode observar no código acima, utilizamos <em>require</em> com um <em>callback</em> para
    ser executado após a carga dos <em>assets</em> demandados.
</p>
<p>
    Agora vamos criar as dependências que faltam. Ainda dentro do diretório <em>/app/tags</em>
    crie os arquivos <em>my-app.scss</em> e <em>lipsum.tag</em>:
</p>

<pre>
    $default-color: blue;
    $active-color: red;

    button {
        background: $default-color;
        border: 0;
        color: white;
        outline: none;

        &.active {
            background: $active-color;
        }
    }
</pre>
<pre>
    &lt;lipsum&gt;
        &lt;div&gt;
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        &lt;/div&gt;
    &lt;/lipsum&gt;
</pre>
<p>
    Ahhh, e agora que temos as custom tags criadas, podemos substituir o conteúdo do <em>/app/main.js</em>
    para renderizar as tags no devido lugar:
</p>

<pre>
    window.riot = require('riot');
    require('./tags/my-app.tag');
    window.riot.mount('*');
</pre>

<p>
    Se rodássemos o webpack novamente, não teríamos sucesso, já que ele ainda não sabe lidar com arquivos <em>.scss</em>
    e <em>.tag</em>.
    Para resolver, voltamos ao <em>webpack.config.js</em>:
</p>

<pre>
    var webpack = require('webpack');

    module.exports = {
      entry: {
          main: './app/main.js'
      },
      output: {
        path: __dirname + '/public/bundles',
        filename: '[name]/bundle.js',
        chunkFilename: '[id]/bundle.js',
        publicPath: '/public/bundles/'
      },
      plugins: [
        new webpack.ProvidePlugin({ riot: 'riot' })
      ],
      module: {
        loaders: [
          { test: /\.tag$/, loader: 'riotjs-loader'},
          { test: /\.scss$/, loaders: ['style', 'css', 'sass'] }
        ]
      }
    };
</pre>
<p>
    As configurações cresceram um pouco, mas o entendimento continua fácil.
    Adicionamos os pre-loaders para arquivos <em>.tag</em> e <em>.scss</em>, e como temos agora carga sob demanda, o
    <strong>webpack</strong> criará <em>bundles</em> separados para estes assets, que serão nomeados conforme o
    padrão definido por <em>chunkFilename</em> e estarão acessíveis a partir do diretório <em>publicPath</em>
    (que poderia ser também uma URL apontando para um CDN).
</p>
<p>
    Agora basta rodar o webpack novamente e abrir /public/main.html para ver tudo funcionando! ;)
</p>
<p>
    <small>
        Obs.: utilize a flag <strong>-p</strong> caso queira gerar o bundle minificado e <strong>--watch</strong>
        para monitorar mudanças nas dependências e gerar novo bundle em caso de mudanças.
    </small>
</p>
<hr/>
<p>
    O código criado neste artigo está disponível no GitHub: <a href="https://github.com/wellguimaraes/webpack-sample">https://github.com/wellguimaraes/webpack-sample</a>
</p>
