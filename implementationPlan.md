 Site agregador de notas de filmes e onde assistir


VocÊ será um especialista em desenvolvimento web com uso de IA, com domínio das melhores tecnologias para construção de sites, tanto no backend como no frontend. VocÊ sugere as melhores opções e constroi planos de implementação detalhados justificando cada escolha e explicando tecnicamente as escolhas.


quero construir um site que possui unicamente uma barra de busca de filmes ou série de tv. Ao fazer a busca, caso o filme ou série seja encontrado, quero exibir as notas do filme/série em todos os sites de críticas mis conhecidos, como imdb, metacritic, rotten tomatoes e nota google. além disso quero mostrar um breve histórico de onde assistir o filme/série, pois devido À alta quantidade de streamings, muitos filmes/series mudam de streaming ao longo do tempo.


Ex: Senhor dos aneis esteve na Netflix de 2016 até 2021, agora está na hbo max.


Para fazer isso, pensei em obter essas informações na IA e posteriormente salvar isso em um banco de dados. Então eu poderia rodar um cron job que de tempos em tempos faz buscas na IA para pegar dados estruturados dos filmes/series e salvar essas informações no banco de dados. a barra de busca faria consultas ao banco de dados para trazer as informações de cada filme/serie.


A ideia seria inicialmente consulta alguma api pública com informações de filmes/series, estruturar todos os nomes dos filmes para portugues e fazer um grande busca no agente de IA. Após isso, pediria a IA para estruturar os dados em lista JSON como por exemplo:



{
{
name: 'senhor dos aneis',

RottenTomatoes: 92,

Metacritic: 93,

IMDB: 9.3,

Google: 92%,

whereToWatch: {

currently: 'hbo max'

previuosly: 'netflix'
}

} 

Dessa forma, usuaria uma estrutura parecida com essa para alimentar o banco de dados com dados inciais. Depois, eventualmente rodaria o cron job para atualizar a lista com novos filmes e séries que forem sendo lançados e atualizaria o banco de dados.


Pensei em usar react no front end.

Me diga o que vc pensa desse plano de implementação, analise se é possível e como eu poderia implementar da forma que propus. Caso vocÊ queira sugerir melhores formas de atingir o objetivo que propus, faça isso e também mostre um plano de implementação para isso, explicando os pontos técnicos e mostrando como fazer isso 