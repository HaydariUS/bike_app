import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  get
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDl9pmS3qLHCFhvfSx-Q_uRHoZCZ_26rtk",
  authDomain: "bikerental-9a384.firebaseapp.com",
  databaseURL: "https://bikerental-9a384-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bikerental-9a384",
  storageBucket: "bikerental-9a384.firebasestorage.app",
  messagingSenderId: "797282370249",
  appId: "1:797282370249:web:c73ff8a988e4a6d6774318"
};

// initializing firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const availableRef = ref(db, "availableBikes");
const rentalsRef = ref(db, "rentals");

let currentAvailableBikes = [];

function updateBikeOptions(bikes) {
  const container = document.getElementById("bikeOptions");
  container.innerHTML = "";

  if (!bikes || bikes.length === 0) {
    container.innerHTML = "<p>No bikes available.</p>";
    return;
  }

  bikes.forEach(bike => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "bike";
    checkbox.value = bike;

    const label = document.createElement("label");
    label.textContent = bike;

    container.appendChild(checkbox);
    container.appendChild(label);
    container.appendChild(document.createElement("br"));
  });
}

onValue(availableRef, (snapshot) => {
  const bikes = snapshot.val() || [];
  currentAvailableBikes = bikes;
  updateBikeOptions(bikes);
});

get(availableRef).then(snapshot => {
  if (!snapshot.exists()) {
    const initial = ["Bike1", "Bike2", "Bike3", "Bike4", "Bike5"];
    set(availableRef, initial);
  }
});


document.getElementById("rentalForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const room = document.getElementById("room").value.trim();
  const selected = Array.from(document.querySelectorAll("input[name='bike']:checked"))
                        .map(cb => cb.value);

  if (name === "" || room === "" || selected.length === 0) {
    alert("Please enter your name, room number, and select at least one bike.");
    return;
  }

  const time = new Date().toLocaleString();

  const rentalData = {
    name,
    room,
    bikes: selected,
    time,
    returnedAt: null
  };

  await push(rentalsRef, rentalData);

  const newAvailable = currentAvailableBikes.filter(bike => !selected.includes(bike));
  await set(availableRef, newAvailable);

  alert("Rental submitted!");
  document.getElementById("rentalForm").reset();
});;