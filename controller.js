import fs from 'fs';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { database } from './firebaseConfig';

const targetLanguages = process.env.TARGET_LANG.split(/\,\s*/);
const sourceLanguage = process.env.SOURCE_LANG;

const speechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(process.env.AZURE_KEY, process.env.AZURE_REGION);
speechTranslationConfig.speechRecognitionLanguage = sourceLanguage;
targetLanguages.forEach((item) => speechTranslationConfig.addTargetLanguage(item));

function continuousRecognition() {
  let pushStream = sdk.AudioInputStream.createPushStream();

  const readStream = fs.createReadStream(process.env.AUDIO_FILE);

  readStream.on('data', function(arrayBuffer) {
      pushStream.write(arrayBuffer.slice());
  }).on('end', function() {
      pushStream.close();
  });

  let audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  let recognizer = new sdk.TranslationRecognizer(speechTranslationConfig, audioConfig);

  recognizer.recognizing = (s, e) => {
    console.log(`RECOGNIZING: Text`);
  };

  recognizer.recognized = (s, e) => {
    targetLanguages.forEach((item) => {
      database.ref(item).push().set({
        text: e.result.translations.get(item),
      })
      console.log(item + ': ', e.result.translations.get(item), "\n");
    });
  };

  recognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`);

      recognizer.stopContinuousRecognitionAsync();
  };

  recognizer.sessionStopped = (s, e) => {
      console.log("\n    Session stopped event.");
      recognizer.stopContinuousRecognitionAsync();
  };

  recognizer.startContinuousRecognitionAsync();
}

export default continuousRecognition;
