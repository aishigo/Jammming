// var accessToken = 'http://localhost:3000/#access_token=BQAq9opjiLCziHq3-Qqou9ML6iriJEn5GIh_U6USm0F8ABf2GQ2l30zUGDDrUFkNQyl2P9JY-UVWkFPYg9yFkWbZe-bL8sColbqWECECqPScM2PaHXYm8C_9NPoZy8w6wWDw1F3O1DnmTWc&token_type=Bearer&expires_in=3600';
var accessToken;
//var mockSpotifyAccessReturn = 'http://localhost:3000/#access_token=BQC5IgvpgpmsO9uLp4EapzgwJXJMr-xbIBNgIUKdUSAqiDAg2LLrCVwJmSrGg2k3bdNA9yV3Hhli6zLywXG-8Z77FujlcRgR-Dzas1T5Zq_eRU7ME-X79RfxoNUYbYFtdne7Du6mNUJgxY8&token_type=Bearer&expires_in=3600';
var mockSpotifyAccessReturn;
const url = 'https://accounts.spotify.com/authorize';
const clientId = 'e68cc779805f4f3989412cab68347530';
const responseType = 'token';
//const redirectURI = 'http://localhost:3000/';
const redirectURI = 'http://jamming-aishigo.surge.sh/';
var userId;
var playlistId;
var expiresIn;


export const Spotify = {
	getAccessToken() {
		if (mockSpotifyAccessReturn) {
			// split here into accessToken, expire
			accessToken = mockSpotifyAccessReturn.match(/access_token=([^&]*)/);
			expiresIn = mockSpotifyAccessReturn.match(/expires_in=([^&]*)/);
		}
		if (accessToken) {
			console.log('getAccessToken: has an accessToken: accessToken: ' + accessToken);
			return accessToken;
		}
		console.log(window.location.href.match(/access_token=([^&]*)/));
		console.log('getAccessToken: Fetching');
		// Try to get one here since we don't yet have one
		// Check window.location.href here
		let newAccessToken = window.location.href.match(/access_token=([^&]*)/);
		let newExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
		// if found, then done
		if (newAccessToken && newExpiresIn) {
			accessToken = newAccessToken[1];
			expiresIn = newExpiresIn[1];
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		}
		// Not found => set window.location with full access url with correct args
		window.location = `${url}?client_id=${clientId}&response_type=${responseType}&scope=playlist-modify-public&show_dialog=true&redirect_uri=${redirectURI}`;

		// Add console.log after set location and see if the dialog pops up and
		// after it tears down, then and only then does the console.log execute
		console.log(window.location.href)
	},

	search(searchTerm) {
		var accessToken = Spotify.getAccessToken();
		var test = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`
		console.log(test);
		// if (mockTracks) {
		//     return mockTracks.tracks.items.map(track => {
		//         return {
		//             id: track.id,
		//             name: track.name,
		//             artist: track.artists[0].name,
		//             album: track.album.name,
		//             uri: track.uri
		//         }
		//     })
		// } else {


		return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
			headers: {Authorization: `Bearer ${accessToken}`}
		}).then(response => {
			if (response.ok) {
				return response.json();
			}
			throw new Error('Request failed!');
		}, networkError => {
			console.log(networkError.message);
		}).then(jsonResponse => {
			if (jsonResponse.tracks) {
				return jsonResponse.tracks.items.map(track => {
					return {
						id: track.id,
						name: track.name,
						artist: track.artists[0].name,
						album: track.album.name,
						uri: track.uri
					}
				})
			} else {
				return [];
			}
		})
		// }
	}
	,

	savePlaylist(playlistName, arrayURIs) {
		var accessToken;
		if (playlistName && arrayURIs && arrayURIs.length !== 0) {
			console.log("setting accessToken");
			accessToken = Spotify.getAccessToken();
			console.log("accessToken: " + accessToken);
		} else {
			console.log('ERROR return');
			return
		}
		return fetch('https://api.spotify.com/v1/me', {
			headers: {Authorization: `Bearer ${accessToken}`}
		}).then(response => {
			console.log('got auth response');
				if (response.ok) {
					return response.json();
				}
				console.log("ERROR, about to throw");
				throw new Error('Request failed!');
			}, networkError => console.log(networkError.message)
		).then(jsonResponse => {
			console.log(jsonResponse);
			// save response id parameter to userId variable
			userId = jsonResponse.id;
			return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
				method: 'POST',
				headers: {Authorization: `Bearer ${accessToken}`},
				body: JSON.stringify({name: playlistName})
			}).then(response => {
					if (response.ok) {
						return response.json();
					}
					throw new Error('Request failed!');
				}, networkError => console.log(networkError.message)
			).then(jsonResponse => {
				playlistId = jsonResponse.id;
				return fetch(`https://api.spotify./v1/users/${userId}/playlists/${playlistId}/tracks`, {
					method: 'POST',
					headers: {Authorization: `Bearer ${accessToken}`},
					body: JSON.stringify({uris: arrayURIs})
				}).then(response => {
					if (response.ok) {
						return response.json();
					}
					throw new Error('Request failed!');
				}, networkError => {
					console.log(networkError.message);
				}).then(jsonResponse => jsonResponse)
			});
		})


	}
}

var mockTracks;
var mockTracksxxx = {
	"tracks": {
		"href": "https://api.spotify.com/v1/search?query=kanye+west&type=track&market=US&offset=0&limit=20",
		"items": [
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/3SZr5Pco2oqKFORCP3WNj9"
					},
					"href": "https://api.spotify.com/v1/albums/3SZr5Pco2oqKFORCP3WNj9",
					"id": "3SZr5Pco2oqKFORCP3WNj9",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/01bb4663dcfa3b8b4fd405ef493dfe447805aa57",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/af440b4e0d8d22cb46b3723164281dfb70cdb4f5",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/ab51387d467672b4e24625d1ad4e57b3f8d3a2ab",
							"width": 64
						}
					],
					"name": "Graduation",
					"type": "album",
					"uri": "spotify:album:3SZr5Pco2oqKFORCP3WNj9"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 311866,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM70741299"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/6C7RJEIUDqKkJRZVWdkfkH"
				},
				"href": "https://api.spotify.com/v1/tracks/6C7RJEIUDqKkJRZVWdkfkH",
				"id": "6C7RJEIUDqKkJRZVWdkfkH",
				"name": "Stronger",
				"popularity": 78,
				"preview_url": null,
				"track_number": 3,
				"type": "track",
				"uri": "spotify:track:6C7RJEIUDqKkJRZVWdkfkH"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/20r762YmB5HeofjMCiPMLv"
					},
					"href": "https://api.spotify.com/v1/albums/20r762YmB5HeofjMCiPMLv",
					"id": "20r762YmB5HeofjMCiPMLv",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/de693f63e4f4f2796ff448ccd73d4b4831faf30b",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/1610aeab18aa441a0a7fc4870ebb9d9060c47395",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/8a1fb961687530ee37b426e104e89da608c7481d",
							"width": 64
						}
					],
					"name": "My Beautiful Dark Twisted Fantasy",
					"type": "album",
					"uri": "spotify:album:20r762YmB5HeofjMCiPMLv"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 292093,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM71018220"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/2gZUPNdnz5Y45eiGxpHGSc"
				},
				"href": "https://api.spotify.com/v1/tracks/2gZUPNdnz5Y45eiGxpHGSc",
				"id": "2gZUPNdnz5Y45eiGxpHGSc",
				"name": "POWER",
				"popularity": 77,
				"preview_url": null,
				"track_number": 3,
				"type": "track",
				"uri": "spotify:track:2gZUPNdnz5Y45eiGxpHGSc"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5T0MSzX9RC5NA6gAI6irSn"
							},
							"href": "https://api.spotify.com/v1/artists/5T0MSzX9RC5NA6gAI6irSn",
							"id": "5T0MSzX9RC5NA6gAI6irSn",
							"name": "Estelle",
							"type": "artist",
							"uri": "spotify:artist:5T0MSzX9RC5NA6gAI6irSn"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/4nAIqmKELnBEXEkYg1pMic"
					},
					"href": "https://api.spotify.com/v1/albums/4nAIqmKELnBEXEkYg1pMic",
					"id": "4nAIqmKELnBEXEkYg1pMic",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/ad9197e187302d798a503b9ec3bf29fc0f6b9390",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/99587b50de203baf74dec318e7d9d53ef369cfeb",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/932fd712cc1e6d17ba90d107dbef37bfcf6242de",
							"width": 64
						}
					],
					"name": "Shine",
					"type": "album",
					"uri": "spotify:album:4nAIqmKELnBEXEkYg1pMic"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5T0MSzX9RC5NA6gAI6irSn"
						},
						"href": "https://api.spotify.com/v1/artists/5T0MSzX9RC5NA6gAI6irSn",
						"id": "5T0MSzX9RC5NA6gAI6irSn",
						"name": "Estelle",
						"type": "artist",
						"uri": "spotify:artist:5T0MSzX9RC5NA6gAI6irSn"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 284733,
				"explicit": true,
				"external_ids": {
					"isrc": "USAT20706210"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/41on8RwRh22IHcChAN2gm8"
				},
				"href": "https://api.spotify.com/v1/tracks/41on8RwRh22IHcChAN2gm8",
				"id": "41on8RwRh22IHcChAN2gm8",
				"name": "American Boy (feat. Kanye West)",
				"popularity": 76,
				"preview_url": "https://p.scdn.co/mp3-preview/c5ee61bf5c6c01d923aec35b6f52df76ac651bfb?cid=d87cb2137c114c47861fc70866867fa6",
				"track_number": 3,
				"type": "track",
				"uri": "spotify:track:41on8RwRh22IHcChAN2gm8"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/5ll74bqtkcXlKE7wwkMq4g"
					},
					"href": "https://api.spotify.com/v1/albums/5ll74bqtkcXlKE7wwkMq4g",
					"id": "5ll74bqtkcXlKE7wwkMq4g",
					"images": [
						{
							"height": 635,
							"url": "https://i.scdn.co/image/92db1dda6ed503723c89c3cf03369c908b1393a3",
							"width": 640
						},
						{
							"height": 298,
							"url": "https://i.scdn.co/image/63103ad4573aa721bbc175b49d8c83e2a145e662",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/0fb0c80656cbb4bf088b5a29bbb0e04c2a3143e5",
							"width": 64
						}
					],
					"name": "Late Registration",
					"type": "album",
					"uri": "spotify:album:5ll74bqtkcXlKE7wwkMq4g"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/7LnaAXbDVIL75IVPnndf7w"
						},
						"href": "https://api.spotify.com/v1/artists/7LnaAXbDVIL75IVPnndf7w",
						"id": "7LnaAXbDVIL75IVPnndf7w",
						"name": "Jamie Foxx",
						"type": "artist",
						"uri": "spotify:artist:7LnaAXbDVIL75IVPnndf7w"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 207626,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM70500143"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/1PS1QMdUqOal0ai3Gt7sDQ"
				},
				"href": "https://api.spotify.com/v1/tracks/1PS1QMdUqOal0ai3Gt7sDQ",
				"id": "1PS1QMdUqOal0ai3Gt7sDQ",
				"name": "Gold Digger",
				"popularity": 77,
				"preview_url": null,
				"track_number": 4,
				"type": "track",
				"uri": "spotify:track:1PS1QMdUqOal0ai3Gt7sDQ"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/0LyfQWJT6nXafLPZqxe9Of"
							},
							"href": "https://api.spotify.com/v1/artists/0LyfQWJT6nXafLPZqxe9Of",
							"id": "0LyfQWJT6nXafLPZqxe9Of",
							"name": "Various Artists",
							"type": "artist",
							"uri": "spotify:artist:0LyfQWJT6nXafLPZqxe9Of"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/1RhLcw3zLwYqNRFQZszBOG"
					},
					"href": "https://api.spotify.com/v1/albums/1RhLcw3zLwYqNRFQZszBOG",
					"id": "1RhLcw3zLwYqNRFQZszBOG",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/44ce69bb14b0689c4be9bd7b3ea78f4374496f7a",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/fde6e532de307a61a74c61fe79034c8d7b507d27",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/81ebf54e7521fe63641cc722412356af1e87293e",
							"width": 64
						}
					],
					"name": "Top Five (Music From And Inspired By The Motion Picture)",
					"type": "album",
					"uri": "spotify:album:1RhLcw3zLwYqNRFQZszBOG"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/3nFkdlSjzX9mRTtwJOzDYB"
						},
						"href": "https://api.spotify.com/v1/artists/3nFkdlSjzX9mRTtwJOzDYB",
						"id": "3nFkdlSjzX9mRTtwJOzDYB",
						"name": "JAY Z",
						"type": "artist",
						"uri": "spotify:artist:3nFkdlSjzX9mRTtwJOzDYB"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 219320,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM71111621"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/2KpCpk6HjXXLb7nnXoXA5O"
				},
				"href": "https://api.spotify.com/v1/tracks/2KpCpk6HjXXLb7nnXoXA5O",
				"id": "2KpCpk6HjXXLb7nnXoXA5O",
				"name": "Ni**as In Paris",
				"popularity": 79,
				"preview_url": null,
				"track_number": 7,
				"type": "track",
				"uri": "spotify:track:2KpCpk6HjXXLb7nnXoXA5O"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/7gsWAHLeT0w7es6FofOXk1"
					},
					"href": "https://api.spotify.com/v1/albums/7gsWAHLeT0w7es6FofOXk1",
					"id": "7gsWAHLeT0w7es6FofOXk1",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/443372cd2c6d4245833fb46ac1c5dabca00c78a9",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/d2351cd8009379e06421c31fe7de3f87178b4e66",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/4c9fcc4c6f9408a4111f963143d8d13fb58df2b3",
							"width": 64
						}
					],
					"name": "The Life Of Pablo",
					"type": "album",
					"uri": "spotify:album:7gsWAHLeT0w7es6FofOXk1"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 135920,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM71603067"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/4KW1lqgSr8TKrvBII0Brf8"
				},
				"href": "https://api.spotify.com/v1/tracks/4KW1lqgSr8TKrvBII0Brf8",
				"id": "4KW1lqgSr8TKrvBII0Brf8",
				"name": "Father Stretch My Hands Pt. 1",
				"popularity": 75,
				"preview_url": null,
				"track_number": 2,
				"type": "track",
				"uri": "spotify:track:4KW1lqgSr8TKrvBII0Brf8"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/7gsWAHLeT0w7es6FofOXk1"
					},
					"href": "https://api.spotify.com/v1/albums/7gsWAHLeT0w7es6FofOXk1",
					"id": "7gsWAHLeT0w7es6FofOXk1",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/443372cd2c6d4245833fb46ac1c5dabca00c78a9",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/d2351cd8009379e06421c31fe7de3f87178b4e66",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/4c9fcc4c6f9408a4111f963143d8d13fb58df2b3",
							"width": 64
						}
					],
					"name": "The Life Of Pablo",
					"type": "album",
					"uri": "spotify:album:7gsWAHLeT0w7es6FofOXk1"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 181573,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM71603079"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/3nAq2hCr1oWsIU54tS98pL"
				},
				"href": "https://api.spotify.com/v1/tracks/3nAq2hCr1oWsIU54tS98pL",
				"id": "3nAq2hCr1oWsIU54tS98pL",
				"name": "Waves",
				"popularity": 74,
				"preview_url": null,
				"track_number": 10,
				"type": "track",
				"uri": "spotify:track:3nAq2hCr1oWsIU54tS98pL"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/7gsWAHLeT0w7es6FofOXk1"
					},
					"href": "https://api.spotify.com/v1/albums/7gsWAHLeT0w7es6FofOXk1",
					"id": "7gsWAHLeT0w7es6FofOXk1",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/443372cd2c6d4245833fb46ac1c5dabca00c78a9",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/d2351cd8009379e06421c31fe7de3f87178b4e66",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/4c9fcc4c6f9408a4111f963143d8d13fb58df2b3",
							"width": 64
						}
					],
					"name": "The Life Of Pablo",
					"type": "album",
					"uri": "spotify:album:7gsWAHLeT0w7es6FofOXk1"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 196040,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM71603020"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/19a3JfW8BQwqHWUMbcqSx8"
				},
				"href": "https://api.spotify.com/v1/tracks/19a3JfW8BQwqHWUMbcqSx8",
				"id": "19a3JfW8BQwqHWUMbcqSx8",
				"name": "Famous",
				"popularity": 74,
				"preview_url": null,
				"track_number": 4,
				"type": "track",
				"uri": "spotify:track:19a3JfW8BQwqHWUMbcqSx8"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/7gsWAHLeT0w7es6FofOXk1"
					},
					"href": "https://api.spotify.com/v1/albums/7gsWAHLeT0w7es6FofOXk1",
					"id": "7gsWAHLeT0w7es6FofOXk1",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/443372cd2c6d4245833fb46ac1c5dabca00c78a9",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/d2351cd8009379e06421c31fe7de3f87178b4e66",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/4c9fcc4c6f9408a4111f963143d8d13fb58df2b3",
							"width": 64
						}
					],
					"name": "The Life Of Pablo",
					"type": "album",
					"uri": "spotify:album:7gsWAHLeT0w7es6FofOXk1"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 320680,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM71603065"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/1eQBEelI2NCy7AUTerX0KS"
				},
				"href": "https://api.spotify.com/v1/tracks/1eQBEelI2NCy7AUTerX0KS",
				"id": "1eQBEelI2NCy7AUTerX0KS",
				"name": "Ultralight Beam",
				"popularity": 73,
				"preview_url": null,
				"track_number": 1,
				"type": "track",
				"uri": "spotify:track:1eQBEelI2NCy7AUTerX0KS"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/6jJ0s89eD6GaHleKKya26X"
							},
							"href": "https://api.spotify.com/v1/artists/6jJ0s89eD6GaHleKKya26X",
							"id": "6jJ0s89eD6GaHleKKya26X",
							"name": "Katy Perry",
							"type": "artist",
							"uri": "spotify:artist:6jJ0s89eD6GaHleKKya26X"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/5BvgP623rtvlc0HDcpzquz"
					},
					"href": "https://api.spotify.com/v1/albums/5BvgP623rtvlc0HDcpzquz",
					"id": "5BvgP623rtvlc0HDcpzquz",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/33080534f9716c159af3cc491162a3e8745e6d84",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/0a34d15c8d2011f585dcc0c30e15d1e83cbe9e1e",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/9c84f17be53a336eac917f3eb34913338030d548",
							"width": 64
						}
					],
					"name": "Katy Perry - Teenage Dream: The Complete Confection",
					"type": "album",
					"uri": "spotify:album:5BvgP623rtvlc0HDcpzquz"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/6jJ0s89eD6GaHleKKya26X"
						},
						"href": "https://api.spotify.com/v1/artists/6jJ0s89eD6GaHleKKya26X",
						"id": "6jJ0s89eD6GaHleKKya26X",
						"name": "Katy Perry",
						"type": "artist",
						"uri": "spotify:artist:6jJ0s89eD6GaHleKKya26X"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 229573,
				"explicit": false,
				"external_ids": {
					"isrc": "USCA21100386"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/36ux3YuUsGTWPT8fXclS45"
				},
				"href": "https://api.spotify.com/v1/tracks/36ux3YuUsGTWPT8fXclS45",
				"id": "36ux3YuUsGTWPT8fXclS45",
				"name": "E.T. - feat. Kanye West",
				"popularity": 72,
				"preview_url": null,
				"track_number": 17,
				"type": "track",
				"uri": "spotify:track:36ux3YuUsGTWPT8fXclS45"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/3WFTGIO6E3Xh4paEOBY9OU"
					},
					"href": "https://api.spotify.com/v1/albums/3WFTGIO6E3Xh4paEOBY9OU",
					"id": "3WFTGIO6E3Xh4paEOBY9OU",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/353e99e5ff167272c245412b52d84bc36185b58d",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/e813e06978f72b9c965957b1b9789e98e1b2458b",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/9eb5ba8c3b1f6877482bb9c3c59fb602c2d27b8a",
							"width": 64
						}
					],
					"name": "808s & Heartbreak",
					"type": "album",
					"uri": "spotify:album:3WFTGIO6E3Xh4paEOBY9OU"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 211000,
				"explicit": false,
				"external_ids": {
					"isrc": "USUM70840511"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/4EWCNWgDS8707fNSZ1oaA5"
				},
				"href": "https://api.spotify.com/v1/tracks/4EWCNWgDS8707fNSZ1oaA5",
				"id": "4EWCNWgDS8707fNSZ1oaA5",
				"name": "Heartless",
				"popularity": 73,
				"preview_url": null,
				"track_number": 3,
				"type": "track",
				"uri": "spotify:track:4EWCNWgDS8707fNSZ1oaA5"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/20r762YmB5HeofjMCiPMLv"
					},
					"href": "https://api.spotify.com/v1/albums/20r762YmB5HeofjMCiPMLv",
					"id": "20r762YmB5HeofjMCiPMLv",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/de693f63e4f4f2796ff448ccd73d4b4831faf30b",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/1610aeab18aa441a0a7fc4870ebb9d9060c47395",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/8a1fb961687530ee37b426e104e89da608c7481d",
							"width": 64
						}
					],
					"name": "My Beautiful Dark Twisted Fantasy",
					"type": "album",
					"uri": "spotify:album:20r762YmB5HeofjMCiPMLv"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 299613,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM71027273"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/22L7bfCiAkJo5xGSQgmiIO"
				},
				"href": "https://api.spotify.com/v1/tracks/22L7bfCiAkJo5xGSQgmiIO",
				"id": "22L7bfCiAkJo5xGSQgmiIO",
				"name": "All Of The Lights",
				"popularity": 73,
				"preview_url": null,
				"track_number": 5,
				"type": "track",
				"uri": "spotify:track:22L7bfCiAkJo5xGSQgmiIO"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/7D2NdGvBHIavgLhmcwhluK"
					},
					"href": "https://api.spotify.com/v1/albums/7D2NdGvBHIavgLhmcwhluK",
					"id": "7D2NdGvBHIavgLhmcwhluK",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/87982737e43f86e172dbf9897f6e437fde2d7caf",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/9f869b8abefaa75f9bae84cbe758b19a95533237",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/0ab731d75ad5a1f95376adaa1b4670132a77ba42",
							"width": 64
						}
					],
					"name": "Yeezus",
					"type": "album",
					"uri": "spotify:album:7D2NdGvBHIavgLhmcwhluK"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 188013,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM71307719"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/722tgOgdIbNe3BEyLnejw4"
				},
				"href": "https://api.spotify.com/v1/tracks/722tgOgdIbNe3BEyLnejw4",
				"id": "722tgOgdIbNe3BEyLnejw4",
				"name": "Black Skinhead",
				"popularity": 73,
				"preview_url": null,
				"track_number": 2,
				"type": "track",
				"uri": "spotify:track:722tgOgdIbNe3BEyLnejw4"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5IcR3N7QB1j6KBL8eImZ8m"
							},
							"href": "https://api.spotify.com/v1/artists/5IcR3N7QB1j6KBL8eImZ8m",
							"id": "5IcR3N7QB1j6KBL8eImZ8m",
							"name": "ScHoolboy Q",
							"type": "artist",
							"uri": "spotify:artist:5IcR3N7QB1j6KBL8eImZ8m"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/0YbpATCIng8Fz2JrfHmEf7"
					},
					"href": "https://api.spotify.com/v1/albums/0YbpATCIng8Fz2JrfHmEf7",
					"id": "0YbpATCIng8Fz2JrfHmEf7",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/527f35929eff151f80bcabec17b2fb9383da342b",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/b9a947bd8f11dffe05be42aa576fac96c0ec9609",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/1234b5d44e5555090abc2be9fb98cdddcf447931",
							"width": 64
						}
					],
					"name": "Blank Face LP",
					"type": "album",
					"uri": "spotify:album:0YbpATCIng8Fz2JrfHmEf7"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5IcR3N7QB1j6KBL8eImZ8m"
						},
						"href": "https://api.spotify.com/v1/artists/5IcR3N7QB1j6KBL8eImZ8m",
						"id": "5IcR3N7QB1j6KBL8eImZ8m",
						"name": "ScHoolboy Q",
						"type": "artist",
						"uri": "spotify:artist:5IcR3N7QB1j6KBL8eImZ8m"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 313573,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM71604273"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/2yJ9GVCLMmzBBfQAnfzlwr"
				},
				"href": "https://api.spotify.com/v1/tracks/2yJ9GVCLMmzBBfQAnfzlwr",
				"id": "2yJ9GVCLMmzBBfQAnfzlwr",
				"name": "THat Part",
				"popularity": 72,
				"preview_url": null,
				"track_number": 3,
				"type": "track",
				"uri": "spotify:track:2yJ9GVCLMmzBBfQAnfzlwr"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/0LyfQWJT6nXafLPZqxe9Of"
							},
							"href": "https://api.spotify.com/v1/artists/0LyfQWJT6nXafLPZqxe9Of",
							"id": "0LyfQWJT6nXafLPZqxe9Of",
							"name": "Various Artists",
							"type": "artist",
							"uri": "spotify:artist:0LyfQWJT6nXafLPZqxe9Of"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/0cGgwoMge4N2zpTiP2GU6d"
					},
					"href": "https://api.spotify.com/v1/albums/0cGgwoMge4N2zpTiP2GU6d",
					"id": "0cGgwoMge4N2zpTiP2GU6d",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/c8ff9ca3153fd59469676f79ba19968654d5c2bd",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/eb724185a14a2a991a543904d73e56c56a8b6b08",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/d0ba270bb17cd8a3f50f6a860fd387afc2f39f09",
							"width": 64
						}
					],
					"name": "Kanye West Presents Good Music Cruel Summer",
					"type": "album",
					"uri": "spotify:album:0cGgwoMge4N2zpTiP2GU6d"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/0c173mlxpT3dSFRgMO8XPh"
						},
						"href": "https://api.spotify.com/v1/artists/0c173mlxpT3dSFRgMO8XPh",
						"id": "0c173mlxpT3dSFRgMO8XPh",
						"name": "Big Sean",
						"type": "artist",
						"uri": "spotify:artist:0c173mlxpT3dSFRgMO8XPh"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/0ONHkAv9pCAFxb0zJwDNTy"
						},
						"href": "https://api.spotify.com/v1/artists/0ONHkAv9pCAFxb0zJwDNTy",
						"id": "0ONHkAv9pCAFxb0zJwDNTy",
						"name": "Pusha T",
						"type": "artist",
						"uri": "spotify:artist:0ONHkAv9pCAFxb0zJwDNTy"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/17lzZA2AlOHwCwFALHttmp"
						},
						"href": "https://api.spotify.com/v1/artists/17lzZA2AlOHwCwFALHttmp",
						"id": "17lzZA2AlOHwCwFALHttmp",
						"name": "2 Chainz",
						"type": "artist",
						"uri": "spotify:artist:17lzZA2AlOHwCwFALHttmp"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 326346,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM71210090"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/3U8Ev1gISsx6O1uwpsttOD"
				},
				"href": "https://api.spotify.com/v1/tracks/3U8Ev1gISsx6O1uwpsttOD",
				"id": "3U8Ev1gISsx6O1uwpsttOD",
				"name": "Mercy.1",
				"popularity": 67,
				"preview_url": null,
				"track_number": 3,
				"type": "track",
				"uri": "spotify:track:3U8Ev1gISsx6O1uwpsttOD"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/0LyfQWJT6nXafLPZqxe9Of"
							},
							"href": "https://api.spotify.com/v1/artists/0LyfQWJT6nXafLPZqxe9Of",
							"id": "0LyfQWJT6nXafLPZqxe9Of",
							"name": "Various Artists",
							"type": "artist",
							"uri": "spotify:artist:0LyfQWJT6nXafLPZqxe9Of"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/0cGgwoMge4N2zpTiP2GU6d"
					},
					"href": "https://api.spotify.com/v1/albums/0cGgwoMge4N2zpTiP2GU6d",
					"id": "0cGgwoMge4N2zpTiP2GU6d",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/c8ff9ca3153fd59469676f79ba19968654d5c2bd",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/eb724185a14a2a991a543904d73e56c56a8b6b08",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/d0ba270bb17cd8a3f50f6a860fd387afc2f39f09",
							"width": 64
						}
					],
					"name": "Kanye West Presents Good Music Cruel Summer",
					"type": "album",
					"uri": "spotify:album:0cGgwoMge4N2zpTiP2GU6d"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/15iVAtD3s3FsQR4w1v6M0P"
						},
						"href": "https://api.spotify.com/v1/artists/15iVAtD3s3FsQR4w1v6M0P",
						"id": "15iVAtD3s3FsQR4w1v6M0P",
						"name": "Chief Keef",
						"type": "artist",
						"uri": "spotify:artist:15iVAtD3s3FsQR4w1v6M0P"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/0ONHkAv9pCAFxb0zJwDNTy"
						},
						"href": "https://api.spotify.com/v1/artists/0ONHkAv9pCAFxb0zJwDNTy",
						"id": "0ONHkAv9pCAFxb0zJwDNTy",
						"name": "Pusha T",
						"type": "artist",
						"uri": "spotify:artist:0ONHkAv9pCAFxb0zJwDNTy"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/0c173mlxpT3dSFRgMO8XPh"
						},
						"href": "https://api.spotify.com/v1/artists/0c173mlxpT3dSFRgMO8XPh",
						"id": "0c173mlxpT3dSFRgMO8XPh",
						"name": "Big Sean",
						"type": "artist",
						"uri": "spotify:artist:0c173mlxpT3dSFRgMO8XPh"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5pnbUBPifNnlusY8kTBivi"
						},
						"href": "https://api.spotify.com/v1/artists/5pnbUBPifNnlusY8kTBivi",
						"id": "5pnbUBPifNnlusY8kTBivi",
						"name": "Jadakiss",
						"type": "artist",
						"uri": "spotify:artist:5pnbUBPifNnlusY8kTBivi"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 283653,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM71209911"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/12D0n7hKpPcjuUpcbAKjjr"
				},
				"href": "https://api.spotify.com/v1/tracks/12D0n7hKpPcjuUpcbAKjjr",
				"id": "12D0n7hKpPcjuUpcbAKjjr",
				"name": "Don't Like.1",
				"popularity": 65,
				"preview_url": null,
				"track_number": 12,
				"type": "track",
				"uri": "spotify:track:12D0n7hKpPcjuUpcbAKjjr"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/7gsWAHLeT0w7es6FofOXk1"
					},
					"href": "https://api.spotify.com/v1/albums/7gsWAHLeT0w7es6FofOXk1",
					"id": "7gsWAHLeT0w7es6FofOXk1",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/443372cd2c6d4245833fb46ac1c5dabca00c78a9",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/d2351cd8009379e06421c31fe7de3f87178b4e66",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/4c9fcc4c6f9408a4111f963143d8d13fb58df2b3",
							"width": 64
						}
					],
					"name": "The Life Of Pablo",
					"type": "album",
					"uri": "spotify:album:7gsWAHLeT0w7es6FofOXk1"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 236120,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM71603080"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/30Zcjs7pgEkmJA1lEbGSWT"
				},
				"href": "https://api.spotify.com/v1/tracks/30Zcjs7pgEkmJA1lEbGSWT",
				"id": "30Zcjs7pgEkmJA1lEbGSWT",
				"name": "FML",
				"popularity": 70,
				"preview_url": null,
				"track_number": 11,
				"type": "track",
				"uri": "spotify:track:30Zcjs7pgEkmJA1lEbGSWT"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/3SZr5Pco2oqKFORCP3WNj9"
					},
					"href": "https://api.spotify.com/v1/albums/3SZr5Pco2oqKFORCP3WNj9",
					"id": "3SZr5Pco2oqKFORCP3WNj9",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/01bb4663dcfa3b8b4fd405ef493dfe447805aa57",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/af440b4e0d8d22cb46b3723164281dfb70cdb4f5",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/ab51387d467672b4e24625d1ad4e57b3f8d3a2ab",
							"width": 64
						}
					],
					"name": "Graduation",
					"type": "album",
					"uri": "spotify:album:3SZr5Pco2oqKFORCP3WNj9"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 271600,
				"explicit": true,
				"external_ids": {
					"isrc": "USUM70739239"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/4ImL3v98u2BLkwnyQDjfRm"
				},
				"href": "https://api.spotify.com/v1/tracks/4ImL3v98u2BLkwnyQDjfRm",
				"id": "4ImL3v98u2BLkwnyQDjfRm",
				"name": "Can't Tell Me Nothing",
				"popularity": 70,
				"preview_url": null,
				"track_number": 6,
				"type": "track",
				"uri": "spotify:track:4ImL3v98u2BLkwnyQDjfRm"
			},
			{
				"album": {
					"album_type": "single",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5pKCCKE2ajJHZ9KAiaK11H"
							},
							"href": "https://api.spotify.com/v1/artists/5pKCCKE2ajJHZ9KAiaK11H",
							"id": "5pKCCKE2ajJHZ9KAiaK11H",
							"name": "Rihanna",
							"type": "artist",
							"uri": "spotify:artist:5pKCCKE2ajJHZ9KAiaK11H"
						},
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						},
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/4STHEaNw4mPZ2tzheohgXB"
							},
							"href": "https://api.spotify.com/v1/artists/4STHEaNw4mPZ2tzheohgXB",
							"id": "4STHEaNw4mPZ2tzheohgXB",
							"name": "Paul McCartney",
							"type": "artist",
							"uri": "spotify:artist:4STHEaNw4mPZ2tzheohgXB"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/7yBl4uFyJzH48Vy6tPieXL"
					},
					"href": "https://api.spotify.com/v1/albums/7yBl4uFyJzH48Vy6tPieXL",
					"id": "7yBl4uFyJzH48Vy6tPieXL",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/34b6203421f7d638d7a29656d5f1e6d6600a4773",
							"width": 640
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/b5ae02f9627e9b5d264e584bbaf371d172ff726d",
							"width": 300
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/aa06cd1cad70bedc08868f8c44e03c16ecd037e2",
							"width": 64
						}
					],
					"name": "FourFiveSeconds",
					"type": "album",
					"uri": "spotify:album:7yBl4uFyJzH48Vy6tPieXL"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5pKCCKE2ajJHZ9KAiaK11H"
						},
						"href": "https://api.spotify.com/v1/artists/5pKCCKE2ajJHZ9KAiaK11H",
						"id": "5pKCCKE2ajJHZ9KAiaK11H",
						"name": "Rihanna",
						"type": "artist",
						"uri": "spotify:artist:5pKCCKE2ajJHZ9KAiaK11H"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/4STHEaNw4mPZ2tzheohgXB"
						},
						"href": "https://api.spotify.com/v1/artists/4STHEaNw4mPZ2tzheohgXB",
						"id": "4STHEaNw4mPZ2tzheohgXB",
						"name": "Paul McCartney",
						"type": "artist",
						"uri": "spotify:artist:4STHEaNw4mPZ2tzheohgXB"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 188238,
				"explicit": false,
				"external_ids": {
					"isrc": "USJMT1500001"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/78TTtXnFQPzwqlbtbwqN0y"
				},
				"href": "https://api.spotify.com/v1/tracks/78TTtXnFQPzwqlbtbwqN0y",
				"id": "78TTtXnFQPzwqlbtbwqN0y",
				"name": "FourFiveSeconds",
				"popularity": 73,
				"preview_url": null,
				"track_number": 1,
				"type": "track",
				"uri": "spotify:track:78TTtXnFQPzwqlbtbwqN0y"
			},
			{
				"album": {
					"album_type": "album",
					"artists": [
						{
							"external_urls": {
								"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
							},
							"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
							"id": "5K4W6rqBFWDnAN6FQUkS6x",
							"name": "Kanye West",
							"type": "artist",
							"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
						}
					],
					"available_markets": [
						"AD",
						"AR",
						"AT",
						"AU",
						"BE",
						"BG",
						"BO",
						"BR",
						"CA",
						"CH",
						"CL",
						"CO",
						"CR",
						"CY",
						"CZ",
						"DE",
						"DK",
						"DO",
						"EC",
						"EE",
						"ES",
						"FI",
						"FR",
						"GB",
						"GR",
						"GT",
						"HK",
						"HN",
						"HU",
						"ID",
						"IE",
						"IS",
						"IT",
						"JP",
						"LI",
						"LT",
						"LU",
						"LV",
						"MC",
						"MT",
						"MX",
						"MY",
						"NI",
						"NL",
						"NO",
						"NZ",
						"PA",
						"PE",
						"PH",
						"PL",
						"PT",
						"PY",
						"SE",
						"SG",
						"SK",
						"SV",
						"TH",
						"TR",
						"TW",
						"US",
						"UY",
						"VN"
					],
					"external_urls": {
						"spotify": "https://open.spotify.com/album/3ff2p3LnR6V7m6BinwhNaQ"
					},
					"href": "https://api.spotify.com/v1/albums/3ff2p3LnR6V7m6BinwhNaQ",
					"id": "3ff2p3LnR6V7m6BinwhNaQ",
					"images": [
						{
							"height": 640,
							"url": "https://i.scdn.co/image/aa5b579c2da0dba06b5597127644d3d46f254cdb",
							"width": 629
						},
						{
							"height": 300,
							"url": "https://i.scdn.co/image/eb36afa5a4aec96d69b93e0206b53e1233149de7",
							"width": 295
						},
						{
							"height": 64,
							"url": "https://i.scdn.co/image/ef18139a899f170ac5f25aa462aa514d1479e288",
							"width": 63
						}
					],
					"name": "The College Dropout",
					"type": "album",
					"uri": "spotify:album:3ff2p3LnR6V7m6BinwhNaQ"
				},
				"artists": [
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"
						},
						"href": "https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x",
						"id": "5K4W6rqBFWDnAN6FQUkS6x",
						"name": "Kanye West",
						"type": "artist",
						"uri": "spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"
					},
					{
						"external_urls": {
							"spotify": "https://open.spotify.com/artist/1lE6SEy8f84Zhjvp7r8yTD"
						},
						"href": "https://api.spotify.com/v1/artists/1lE6SEy8f84Zhjvp7r8yTD",
						"id": "1lE6SEy8f84Zhjvp7r8yTD",
						"name": "Syleena Johnson",
						"type": "artist",
						"uri": "spotify:artist:1lE6SEy8f84Zhjvp7r8yTD"
					}
				],
				"available_markets": [
					"AD",
					"AR",
					"AT",
					"AU",
					"BE",
					"BG",
					"BO",
					"BR",
					"CA",
					"CH",
					"CL",
					"CO",
					"CR",
					"CY",
					"CZ",
					"DE",
					"DK",
					"DO",
					"EC",
					"EE",
					"ES",
					"FI",
					"FR",
					"GB",
					"GR",
					"GT",
					"HK",
					"HN",
					"HU",
					"ID",
					"IE",
					"IS",
					"IT",
					"JP",
					"LI",
					"LT",
					"LU",
					"LV",
					"MC",
					"MT",
					"MX",
					"MY",
					"NI",
					"NL",
					"NO",
					"NZ",
					"PA",
					"PE",
					"PH",
					"PL",
					"PT",
					"PY",
					"SE",
					"SG",
					"SK",
					"SV",
					"TH",
					"TR",
					"TW",
					"US",
					"UY",
					"VN"
				],
				"disc_number": 1,
				"duration_ms": 223506,
				"explicit": true,
				"external_ids": {
					"isrc": "USDJ20301703"
				},
				"external_urls": {
					"spotify": "https://open.spotify.com/track/2cYZpcIV39X48RnOFM7w2V"
				},
				"href": "https://api.spotify.com/v1/tracks/2cYZpcIV39X48RnOFM7w2V",
				"id": "2cYZpcIV39X48RnOFM7w2V",
				"name": "All Falls Down",
				"popularity": 70,
				"preview_url": null,
				"track_number": 4,
				"type": "track",
				"uri": "spotify:track:2cYZpcIV39X48RnOFM7w2V"
			}
		],
		"limit": 20,
		"next": "https://api.spotify.com/v1/search?query=kanye+west&type=track&market=US&offset=20&limit=20",
		"offset": 0,
		"previous": null,
		"total": 3092
	}
}
