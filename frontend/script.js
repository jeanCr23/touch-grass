// Function to get the stored username or prompt the user to input one
function getUsername() {
  let username = localStorage.getItem("username");
  if (!username) {
    username = prompt("Please enter your username:");
    if (username) {
      localStorage.setItem("username", username);
    } else {
      alert("Username is required to proceed!");
      return null;
    }
  }
  return username;
}

// Fetch user stats from the backend and update the page
async function fetchUserStats() {
  const username = getUsername();
  if (!username) return;

  try {
    const response = await fetch(`http://localhost:5001/api/users/${username}`);
    if (!response.ok) {
      throw new Error("User not found");
    }

    const user = await response.json();
    document.getElementById(
      "grass-points"
    ).textContent = `Grass points: ${user.grassPoints}`;
    document.getElementById(
      "last-touched"
    ).textContent = `Last touched grass: ${new Date(
      user.lastActiveDate
    ).toDateString()}`;

    // Check if the user has already touched grass today
    const lastActiveDate = new Date(user.lastActiveDate).toDateString();
    const currentDate = new Date().toDateString();
    if (lastActiveDate === currentDate) {
      disableTouchGrassButton();
    } else {
      resetTouchGrassUI();
    }
  } catch (error) {
    console.error("Error fetching user stats:", error);
    alert(
      "Error fetching user stats. Please make sure your username is correct."
    );
  }
}

// Handle button click to simulate touching grass
document
  .getElementById("generate-img-btn")
  .addEventListener("click", async () => {
    const username = getUsername();
    if (!username) return;

    try {
      const response = await fetch("http://localhost:5001/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          grassPoints: 10, // Example increment
          streak: 1, // Example increment
        }),
      });

      if (response.ok) {
        // Change image to grass-touched
        document.getElementById("grass-status-img").src =
          "images/grass-touched.jpg";

        // Change the H1 text
        document.querySelector("h1").textContent = "Yay, you've touched grass!";

        // Disable the button and update text
        disableTouchGrassButton();

        // Update stats
        fetchUserStats();
      } else {
        const errorData = await response.json();
        console.error("Error updating user stats:", errorData);
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error on button click:", error);
      alert("Error updating user stats.");
    }
  });

// Disable the button and change the text to "Click me tomorrow!"
function disableTouchGrassButton() {
  const button = document.getElementById("generate-img-btn");
  button.textContent = "Click me tomorrow!";
  button.disabled = true;
}

// Reset the button, image, and H1 text at midnight
function resetTouchGrassUI() {
  const button = document.getElementById("generate-img-btn");
  const currentDate = new Date().toDateString();

  if (localStorage.getItem("lastResetDate") !== currentDate) {
    // Reset button
    button.textContent = "Click me!";
    button.disabled = false;

    // Reset image
    document.getElementById("grass-status-img").src =
      "images/grass-not-touched.png";

    // Reset H1 text
    document.querySelector("h1").textContent = "Go touch grass 🍃";

    // Store the reset date
    localStorage.setItem("lastResetDate", currentDate);
  }
}

// Check for UI reset at midnight every second
setInterval(resetTouchGrassUI, 1000);

// Fetch stats when the page loads
document.addEventListener("DOMContentLoaded", fetchUserStats);
