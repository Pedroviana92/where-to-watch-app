Como a disponibilidade de notas está baixa no endpoint atual, quero fazer uma alteração
apenas na busca de notas dos filmes e séries que ocorre na função getRatings que é chamada no route.ts e é implementada no omdb.ts.

quero usar uma nova api da rapidApi chamada Movie Database Alternative para obter as notas de filmes e séries

A documentação está aqui: https://rapidapi.com/rapidapi/api/movie-database-alternative/playground/apiendpoint_4be0cbf6-94a7-4d2a-857f-e850bfe311d0

A base url para a requisição é essa: rapidapi.com e a chave da api é 184a5b4864mshd39f7e455b1d878p134d19jsnad12bbf6b6ee

Abaixo tem um code snipet de exemplo da requisição: 

<CODE>

const http = require('https');

const options = {
	method: 'GET',
	hostname: 'movie-database-alternative.p.rapidapi.com',
	port: null,
	path: '/?r=json&i=tt4154796',
	headers: {
		'x-rapidapi-key': '184a5b4864mshd39f7e455b1d878p134d19jsnad12bbf6b6ee',
		'x-rapidapi-host': 'movie-database-alternative.p.rapidapi.com'
	}
};

const req = http.request(options, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});

req.end();

</CODE>

observe que o parâmetro i passado como parâmetro é o imdb_id que a aplicação atualmente já obtem na busca inicial e também é salvo no banco de dados na tabela movies. 

O JSON de resposta esperado é: 

<CODE>

{
  "Title": "Avengers: Endgame",
  "Year": "2019",
  "Rated": "PG-13",
  "Released": "26 Apr 2019",
  "Runtime": "181 min",
  "Genre": "Action, Adventure, Sci-Fi",
  "Director": "Anthony Russo, Joe Russo",
  "Writer": "Christopher Markus, Stephen McFeely, Stan Lee",
  "Actors": "Robert Downey Jr., Chris Evans, Mark Ruffalo",
  "Plot": "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
  "Language": "English, Japanese, Xhosa, German",
  "Country": "United States",
  "Awards": "Nominated for 1 Oscar. 70 wins & 132 nominations total",
  "Poster": "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg",
  "Ratings": [
    {
      "Source": "Internet Movie Database",
      "Value": "8.4/10"
    },
    {
      "Source": "Rotten Tomatoes",
      "Value": "94%"
    },
    {
      "Source": "Metacritic",
      "Value": "78/100"
    }
  ],
  "Metascore": "78",
  "imdbRating": "8.4",
  "imdbVotes": "1,406,540",
  "imdbID": "tt4154796",
  "Type": "movie",
  "DVD": "N/A",
  "BoxOffice": "$858,373,000",
  "Production": "N/A",
  "Website": "N/A",
  "Response": "True"
}

</CODE>

substituia a requisição atual por notas por essa nova api e faça as alterações e adaptações necessárias para continuar funcionando. As outras chamadas de api para outras funções deve permanecer igual, mude apenas a chamada relacionado ao getRatings, ou seja, notas para os filmes e séries. Continue salvando os resultados no banco de dados igual já é feito.

