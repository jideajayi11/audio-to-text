# Cognitive Recognition

#### App to convert speech in an Audio file to text in specified language translations. The text translations are then stored in a database to be used in realtime.

## Technology
- NodeJS - Programming Language
- Speech Service - Used the Microsoft Azure Speech Service API to convert the speech stream to text.
- Firebase - Used **Firebase Realtime Database** to store the translated texts. An event listener can then be implemented on a client app to retrieve the texts in realtime as they are being stored in the database.

## How to Use
* Clone the app.
* Install the dependencies
* Populate .env file
  * Create a project on the [Azure speech service](https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices) to get a subscription key and service region to be used as `AZURE_KEY` and `AZURE_REGION` in your .env file
  * Create a realtime database on firebase and copy the configuration parameters to the .env file
  * Add the audio file (.wav) to this server and specify the relative path in the .env file
  * Add the language locale code of the audio file in the .env file e.g `SOURCE_LANG="en-US"` for English (United States)
  * Add a comma separated list of the language codes for your desired output text translations in the .env file e.g `TARGET_LANG="en,fr,de"` for English, French and German respectively.
* Run `npm start` to start recognition


### Author - Jide Ajayi
