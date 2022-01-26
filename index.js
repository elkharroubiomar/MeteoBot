//EL KHAROUBI OMAR 5^CIA 23/01/22 			METEO APP

const TelegramBot = require('node-telegram-bot-api'); //includo la libreria scaricata in precedenza
const http = require('http'); //libreria

const token = '5203091688:AAGL0PWWMBaZafNNY4s8nXMLLGeVAjKUgmg'; //è fornito da telegram bot father e serve per autenticarsi e modificare il bot
const meteoAppId = 'e6871a347a7b5daa67b0b9367df215fb';	//codice univoco fornito dal sito del meteo

const bot = new TelegramBot(token, {polling: true});	//viene creata un'istanza //Il polling è una semplice alternativa ai socket Web o agli eventi del server.

bot.onText(/\/meteo (.+)/, (msg, match) => {	//preleva i dati
	const chatId = msg.chat.id;					//prende l'id della chat nel mio caso è 334820789, nel caso di qualcun altro sarà diverso
	const city = match[1] ? match[1] : "";		//assegna alla citta ciò che è stato scritto da dopo "/meteo" fino all'ultima parola
	http.get('http://api.openweathermap.org/data/2.5/weather?q='+ city + '&units=metric&lang=it&APPID=' + meteoAppId, (res) =>{		//chiamata al server del meteo //res rappresenta la risposta del server
		let rawDat = '';
		res.on('data', (chunk) => { rawDat += chunk;});	//estrae i dati // chunk rappresenta il blocco di dati
		res.on('end', () => {			//quando ha finito di estrarre la risposta, andiamo a leggerla
			try{
				const parsedData = JSON.parse(rawDat);	//analizza una stringa JSON, costruendo il valore JavaScript o l'oggetto descritto dalla stringa.
				var messages = [];			//array di risposte
				parsedData.weather.forEach(function(value) {  	//forEach() metodo esegue una funzione fornita una volta per ogni elemento dell'array.
					messages.push("Meteo: " + value.description);		//value rappresenta il valore // 
				});

				messages.push("Temperatura: " + parsedData.main.temp + "°C");
				messages.push("Vento: " + parsedData.wind.speed + "m/s");

				bot.sendMessage(chatId, messages.join("\n"));				//fornisce una stringa composta da tutti gli elementi di un array, separati dall'a capo
			} catch(e){
				bot.sendMessage(chatId, "errore: " + e.messages);		//nel caso ci siano problemi con il luogo
			}
		})
	}).on('error', (e) => {
		bot.sendMessage(chatId, "errore: " + e.message);	//nel caso la chiamata al server non si verificasse
	});
});
