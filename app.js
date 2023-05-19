require('dotenv').config()

const express = require('express')
const https = require('node:https')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname))
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

app.post('/', (req, res) => {
	let userCity = req.body.cityName
	let query = userCity
	let unit = req.body.units
	let url = `${process.env.WEATHER_URI}&q=${query}&units=${unit}`

	https.get(url, response => {
		console.log(response.statusCode)
		if (response.statusCode === 200) {
			response.on('data', data => {
				const weatherData = JSON.parse(data)
				let temp = weatherData.main.temp
				let city = weatherData.name
				let weatherIcon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`

				let desc = weatherData.weather[0].description

				let searchResult = `<!DOCTYPE html>
					<html lang="en">
						<head>
							<meta charset="UTF-8" />
							<meta http-equiv="X-UA-Compatible" content="IE=edge" />
							<meta name="viewport" content="width=device-width, initial-scale=1.0" />
							<title>Document</title>
							<link
								href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
								rel="stylesheet"
								integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ"
								crossorigin="anonymous"
							/>
							<style>
								body {
									height: 100vh;
								}
								.forecast {
									height: 80vh;
								}
							</style>
						</head>
						<body>
							<main class="container-fluid d-flex flex-column forecast justify-content-center align-items-center">
								<div class="px-4 py-5 my-5 text-center">
									<img class="d-block mx-auto mb-4" src=${weatherIcon} alt="" width="200" >
									<h1 class="display-5 fw-bold text-body-emphasis">${city} Forecast</h1>
									<div class="col-lg-6 mx-auto">
										<p class="lead mb-4">The temperature in ${city} is <h1 class="text-primary">${temp} &deg; ${
					unit === 'metric' ? 'C' : 'F'
				}</h1> with ${desc}</p>
										<div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
											<a href='/'><button type="button" class="btn btn-primary btn-lg px-4 gap-3" fdprocessedid="7ob8rj">Search again</button></a>
										</div>
									</div>
								</div>
							</main>
							<script
									src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
									integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe"
									crossorigin="anonymous"></script>
						</body>
					</html>`

				res.send(searchResult)
				// console.log(weatherData)
			})
		} else {
			let failurePage = `<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta http-equiv="X-UA-Compatible" content="IE=edge" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Failure</title>
					<link
						href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
						rel="stylesheet"
						integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ"
						crossorigin="anonymous"
					/>
					<link rel="stylesheet" href="./css/style.css" type="text/css" />
				</head>
				<body>
					<main
						class="container-fluid d-flex justify-content-center align-items-center"
						id="landing"
					>
						<div class="px-4 py-5 my-5 text-center w-100">
						
							<h1 class="display-5 fw-bold text-body-emphasis green-text">
								${response.statusCode}: ${response.statusMessage}
							</h1>
							<div class="col-lg-6 mx-auto">
								<p class="lead mb-4">
									There was a problem finding the city you searched for.
									<br />Please try again!
								</p>
						
							</div>
						</div>
					</main>

					<script
						src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
						integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe"
						crossorigin="anonymous"
					></script>
				</body>
			</html>
			`
			res.write(failurePage)
			res.write(`		<div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
						<a href="/">
							<button
								type="button"
								class="btn btn-primary btn-lg px-5 gap-3 border-0"
								fdprocessedid="ifanzq"
							>
								Try again
							</button>
						</a>
					</div>`)
			res.send()
			console.log(response.statusMessage)
		}
	})
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
