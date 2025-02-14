let tasks = [];
let reminders = [];

const inputBox = document.getElementById("input-box");
const reminderInput = document.getElementById("reminder");
const urgencySelect = document.getElementById("urgency-select");
const listContainer = document.getElementById("list-container");
const progressBar = document.getElementById("progress-bar");
const notificationContainer = document.getElementById("notification-container");

function addTask() {
  if (!inputBox.value) {
    alert("You must write something!");
    return;
  }

  tasks.push({
    title: inputBox.value,
    reminder: reminderInput.value,
    urgency: urgencySelect.value,
    completed: false,
  });

  if (reminderInput.value) {
    reminders.push({
      task: inputBox.value,
      time: new Date(reminderInput.value).getTime(),
    });
  }

  inputBox.value = "";
  reminderInput.value = "";
  saveData();
  render();
}

function render() {
  listContainer.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${task.title} ${task.reminder ? `(Reminder: ${task.reminder})` : ""}`;
    li.className = task.urgency;
    if (task.completed) li.classList.add("checked");

    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    span.addEventListener("click", () => removeTask(index));

    li.addEventListener("click", () => toggleTask(index));
    li.classList.add("added");

    li.appendChild(span);
    listContainer.appendChild(li);
  });
  updateProgress();
}

function removeTask(index) {
  tasks.splice(index, 1);
  saveData();
  render();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveData();
  render();
}

function updateProgress() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const percentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  progressBar.style.width = percentage + "%";
  document.getElementById("progress-text").innerText = `${Math.round(percentage)}% Completed`;
}

function notify(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerHTML = message;

  notificationContainer.appendChild(notification);
  setTimeout(() => notification.remove(), 4000);
}

function checkReminders() {
  const currentTime = Date.now();
  reminders = reminders.filter((reminder) => {
    if (reminder.time <= currentTime) {
      notify(`Reminder: ${reminder.task}`);
      return false;
    }
    return true;
  });
}

function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadData() {
  tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  render();
}

loadData();
setInterval(checkReminders, 60000);
