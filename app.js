const allBikes = ["Bike1", "Bike2", "Bike3", "Bike4", "Bike5"];
let availableBikes = JSON.parse(localStorage.getItem("availableBikes")) || [...allBikes];
let rentals = JSON.parse(localStorage.getItem("rentals")) || [];

function updateBikeOptions() {
  const container = document.getElementById("bikeOptions");
  container.innerHTML = "";

  if (availableBikes.length === 0) {
    container.innerHTML = "<p>No bikes available.</p>";
    return;
  }

  availableBikes.forEach(bike => {
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

function saveData() {
  localStorage.setItem("availableBikes", JSON.stringify(availableBikes));
  localStorage.setItem("rentals", JSON.stringify(rentals));
}

document.getElementById("rentalForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const room = document.getElementById("room").value.trim(); 
  const selected = Array.from(document.querySelectorAll("input[name='bike']:checked"))
                        .map(cb => cb.value);

  if (name === "" || room === "" || selected.length === 0) {
    alert("Please enter your name, room number, and select at least one bike.");
    return;
  }

  rentals.push({
    name,
    room, 
    bikes: selected,
    time: new Date().toLocaleString()
  });

  availableBikes = availableBikes.filter(bike => !selected.includes(bike));
  localStorage.setItem("rentals", JSON.stringify(rentals));
  localStorage.setItem("availableBikes", JSON.stringify(availableBikes));

  document.getElementById("rentalForm").reset();
  updateBikeOptions();
});

updateBikeOptions();
