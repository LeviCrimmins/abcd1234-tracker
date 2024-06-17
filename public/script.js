// Get references to HTML elements using DOM selection
const form = document.getElementById("taskform");
const tasklist = document.getElementById("tasklist");

// Event listener for form submission
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission from refreshing the page

  // Access form inputs using form.elements
  let title = form.elements.title.value;
  let date = form.elements.Date.value;
  let timeTaken = form.elements.timeTaken.value;
  let distance = form.elements.distance.value;
  let heartrate = form.elements.Heartrate.value;

  // Call addTask function with form input values
  addTask(title, date, timeTaken, distance, heartrate);

  // Save tasks to local storage
  saveTasks();

  // Clear the form inputs after submission
  form.reset();
});

// Array to store tasks, initially load from local storage if available
let taskList = JSON.parse(localStorage.getItem('taskList')) || [];

// Store chart instances
let distanceChartInstance;
let heartrateChartInstance;
let timeTakenChartInstance;

// Function to add task to taskList array
function addTask(title, date, timeTaken, distance, heartrate) {
  let task = {
    title,
    date,
    timeTaken,
    distance,
    heartrate
  };

  taskList.push(task); // Add task object to taskList array

  // Render the task on the page
  renderTask(task);

  // Update charts with new data
  updateCharts();
}

// Function to render task on the page
function renderTask(task) {
  let item = document.createElement("li");
  item.innerHTML = `
    <p>Title: ${task.title}</p>
    <p>Date: ${task.date}</p>
    <p>Time Taken: ${task.timeTaken} minutes</p>
    <p>Distance: ${task.distance} Km</p>
    <p>Heartrate: ${task.heartrate}</p>
  `;

  // Add delete button
  let delButton = document.createElement("button");
  delButton.textContent = "Delete";
  delButton.addEventListener("click", function() {
    item.remove(); // Remove task item from the list
    // Remove task from taskList array
    taskList = taskList.filter(t => t !== task);
    // Save updated task list to local storage
    saveTasks();
    // Update charts after deleting a task
    updateCharts();
  });
  item.appendChild(delButton);

  tasklist.appendChild(item); // Append task item to tasklist ul element
}

// Function to save tasks to local storage
function saveTasks() {
  localStorage.setItem('taskList', JSON.stringify(taskList));
}

// Function to update existing charts or create new ones if they don't exist
function updateCharts() {
  const dates = taskList.map(task => task.date);
  const distances = taskList.map(task => task.distance);
  const heartrates = taskList.map(task => task.heartrate);
  const timesTaken = taskList.map(task => task.timeTaken);

  // Update Distance Chart
  if (distanceChartInstance) {
    distanceChartInstance.data.labels = dates;
    distanceChartInstance.data.datasets[0].data = distances;
    distanceChartInstance.update();
  } else {
    const distanceCtx = document.getElementById('distanceChart').getContext('2d');
    distanceChartInstance = new Chart(distanceCtx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Distance (Km)',
          data: distances,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'P'
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Distance (Km)'
            }
          }
        }
      }
    });
  }

  // Update Heartrate Chart
  if (heartrateChartInstance) {
    heartrateChartInstance.data.labels = dates;
    heartrateChartInstance.data.datasets[0].data = heartrates;
    heartrateChartInstance.update();
  } else {
    const heartrateCtx = document.getElementById('heartrateChart').getContext('2d');
    heartrateChartInstance = new Chart(heartrateCtx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Heartrate (BPM)',
          data: heartrates,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'P'
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Heartrate (BPM)'
            }
          }
        }
      }
    });
  }

  // Update Time Taken Chart
  if (timeTakenChartInstance) {
    timeTakenChartInstance.data.labels = dates;
    timeTakenChartInstance.data.datasets[0].data = timesTaken;
    timeTakenChartInstance.update();
  } else {
    const timeTakenCtx = document.getElementById('timeTakenChart').getContext('2d');
    timeTakenChartInstance = new Chart(timeTakenCtx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Time Taken (Minutes)',
          data: timesTaken,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'P'
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Time Taken (Minutes)'
            }
          }
        }
      }
    });
  }
}

// Load tasks from local storage on page load
function loadTasks() {
  taskList.forEach(task => renderTask(task));
  updateCharts(); // Update charts after loading tasks
}

// Call loadTasks() on page load to render existing tasks
loadTasks();
