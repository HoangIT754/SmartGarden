// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyABGr2zTjnn42uB7bBVMBjKNz-LZgPXuZw",
  authDomain: "testfirebase-b3a12.firebaseapp.com",
  databaseURL: "https://testfirebase-b3a12-default-rtdb.firebaseio.com",
  projectId: "testfirebase-b3a12",
  storageBucket: "testfirebase-b3a12.appspot.com",
  messagingSenderId: "714863284490",
  appId: "1:714863284490:web:70ba57aab04a8ccafeaaf3",
  measurementId: "G-VJLBKMJV8D",
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase database
var database = firebase.database();

// Get a reference to the "project" node in the database
var projectRef = database.ref("Project");

// Ldr
// Get ldr data
var ldrData = database.ref("Project/ldr");
// Show data in html
ldrData.on("value", function (getdata) {
  var ldr = getdata.val();
  if (ldr == true) {
    document.getElementById("ldr").style.color = "lightgreen";
    document.getElementById("ldr").innerHTML = "Light Available";
  } else {
    document.getElementById("ldr").style.color = "red";
    document.getElementById("ldr").innerHTML = "Light Disable";
  }
});

// Temperature chart
// Get a reference to the canvas element
var chartTemp = document.getElementById("chartTemperature");
// Get data from firebase
var temperatureData = database.ref("Project/Temperature");
// Show data in html
temperatureData.on("value", function (getdata) {
  var temperature = getdata.val();
  document.getElementById("temperature").innerHTML = temperature + "&#8451;";
});
// Process Temperature chart
var chartTemparature = new Chart(chartTemp, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperature",
        data: [],
        borderColor: "red",
        fill: false,
        tension: 0.3,
      },
    ],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "Real-time Chart",
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Time",
        },
        ticks: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Value (°C)",
        },
      },
    },
  },
});


// Humidity chart
// Get a reference to the canvas element
var chartHuma = document.getElementById("chartHumanity");
// Get data from firebase
var humidityData = database.ref("Project/Humidity");
// Show data in html
humidityData.on("value", function (getdata) {
  var humidity = getdata.val();
  document.getElementById("humidity").innerHTML = humidity + "%";
});
// Process Humidity chart
var chartHumidity = new Chart(chartHuma, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Humidity",
        data: [],
        borderColor: "blue",
        fill: false,
        tension: 0.3,
      },
    ],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "Real-time Chart",
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Time",
        },
        ticks: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Value (%)",
        },
      },
    },
  },
});


// Soil chart
// Get a reference to the canvas element
var chartSoil = document.getElementById("chartSoil");
// Get data from firebase
var soilData = database.ref("Project/soil_moisture");
// Show data in html
soilData.on("value", function (getdata) {
  var soil = getdata.val();
  if (soil >= 0 && soil <= 100) {
    document.getElementById("dirtSoil").innerHTML = soil + "%";
  } else {
    document.getElementById("dirtSoil").innerHTML = 0 + "%";
  }
});
// Process Soil Chart
var chartSoil = new Chart(chartSoil, {
  type: "doughnut",
  data: {
    labels: ["Soil", "Remaining"],
    datasets: [
      {
        label: [],
        data: [],
        backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 100, 100)"],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "Real-time Chart",
    },
  },
});


// Update soil Data to chart
soilData.on("value", function (snapshot) {
  var data = snapshot.val();
  if (data >= 0 && data <= 100) {
    chartSoil.data.datasets[0].data = [data, 100 - data];
    chartSoil.update();
  } else {
    data = 0;
    chartSoil.data.datasets[0].data = [data, 100 - data];
    chartSoil.update();
  }
});

// Update data for Temperature chart and Humidity chart
var previousTime = null;
var maxDataPoints = 20; // Maximum number of data points to display

projectRef.on("value", function (snapshot) {
  var data = snapshot.val();
  if (data) {
    // Extract the relevant data from the snapshot
    var temperature = data.Temperature;
    var humidity = data.Humidity;
    var time = data.time;
    // Check if the time value has changed
    if (time !== previousTime) {
      // Update the chart with the new data
      // Limit the number of data points to maxDataPoints
      if (chartTemparature.data.labels.length > maxDataPoints) {
        chartTemparature.data.labels.shift(); // Remove the oldest time label
        chartTemparature.data.datasets[0].data.shift(); // Remove the oldest temperature data point
      }
      chartTemparature.data.labels.push(time);
      chartTemparature.data.datasets[0].data.push(temperature);
      chartTemparature.update();

      if (chartHumidity.data.labels.length > maxDataPoints) {
        chartHumidity.data.labels.shift(); // Remove the oldest time label
        chartHumidity.data.datasets[0].data.shift(); // Remove the oldest humidity data point
      }
      chartHumidity.data.labels.push(time);
      chartHumidity.data.datasets[0].data.push(humidity);
      chartHumidity.update();
      // Update the previousTime variable
      previousTime = time;
    }
  }
});


// Clear Data button
// Get a reference to the "Clear Data" button element
var clearDataButton = document.getElementById("clearDataButton");
// Add a click event listener to the "Clear Data" button
clearDataButton.addEventListener("click", function () {
  // Clear the data in the temperature chart
  chartTemparature.data.labels = [];
  chartTemparature.data.datasets[0].data = [];
  chartTemparature.update();

  // Clear the data in the humidity chart
  chartHumidity.data.labels = [];
  chartHumidity.data.datasets[0].data = [];
  chartHumidity.update();
});
