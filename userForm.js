// Firebase config এখানে বসাবে
const firebaseConfig = {
  apiKey: "AIzaSyAVaFTgmJ2_itWLAnBNn31v78QZjiO7BZU",
  authDomain: "user-information-tm-bot.firebaseapp.com",
  projectId: "user-information-tm-bot",
  storageBucket: "user-information-tm-bot.appspot.com",
  messagingSenderId: "602716147426",
  appId: "1:602716147426:web:4c0545869e59ecc9f9d8bb",
  measurementId: "G-7R0LNRW5ZM"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

const supportForm = document.getElementById('supportForm');
const statusMessage = document.getElementById('statusMessage');

supportForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  statusMessage.textContent = "Submitting your request...";

  const problemType = document.getElementById('problemType').value;
  const userContact = document.getElementById('userContact').value.trim();
  const bkashNumber = document.getElementById('bkashNumber').value.trim();
  const screenshot = document.getElementById('screenshot').files[0];

  let screenshotUrl = "";

  try {
    if (screenshot) {
      const storageRef = storage.ref();
      const fileRef = storageRef.child('screenshots/' + Date.now() + '_' + screenshot.name);
      await fileRef.put(screenshot);
      screenshotUrl = await fileRef.getDownloadURL();
    }

    await db.collection('supportRequests').add({
      problemType,
      userContact,
      bkashNumber,
      screenshotUrl,
      status: 'Submitted',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    statusMessage.textContent = "Your request has been submitted successfully!";
    supportForm.reset();

  } catch (error) {
    statusMessage.textContent = "Error submitting request: " + error.message;
  }
});
