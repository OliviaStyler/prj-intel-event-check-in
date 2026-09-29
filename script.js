// Track attendance counts
let totalAttendees = 0;
const MAX_ATTENDEES = 50;

let waterCount = 0;
let zeroCount = 0;
let powerCount = 0;

// Get DOM elements
const checkInForm = document.getElementById('checkInForm');
const attendeeNameInput = document.getElementById('attendeeName');
const teamSelect = document.getElementById('teamSelect');
const attendeeCountSpan = document.getElementById('attendeeCount');
const progressBar = document.getElementById('progressBar');
const greetingParagraph = document.getElementById('greeting');
const waterCountSpan = document.getElementById('waterCount');
const zeroCountSpan = document.getElementById('zeroCount');
const powerCountSpan = document.getElementById('powerCount');

// Listen for form submission
checkInForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;
  const teamLabel = teamSelect.options[teamSelect.selectedIndex].text;

  if (!attendeeName || !selectedTeam) {
    return;
  }

  // Increment total and update display
  totalAttendees = totalAttendees + 1;
  attendeeCountSpan.textContent = totalAttendees;

  // Calculate percentage and update progress bar
  const percentage = Math.min((totalAttendees / MAX_ATTENDEES) * 100, 100);
  progressBar.style.width = `${percentage}%`;

  // Update specific team count
  if (selectedTeam === 'water') {
    waterCount = waterCount + 1;
    waterCountSpan.textContent = waterCount;
  } else if (selectedTeam === 'zero') {
    zeroCount = zeroCount + 1;
    zeroCountSpan.textContent = zeroCount;
  } else if (selectedTeam === 'power') {
    powerCount = powerCount + 1;
    powerCountSpan.textContent = powerCount;
  }

  // Display personalized welcome message
  greetingParagraph.textContent = `Welcome, ${attendeeName}! Thank you for checking in with ${teamLabel}.`;
  greetingParagraph.className = 'success-message';
  greetingParagraph.style.display = 'block';

  // Reset form for next attendee
  checkInForm.reset();
});
