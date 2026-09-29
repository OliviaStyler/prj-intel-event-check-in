// Constants
const MAX_ATTENDEES = 20;
const STORAGE_KEY = 'intel_summit_attendance_data';

// State variables
let totalAttendees = 0;
let waterCount = 0;
let zeroCount = 0;
let powerCount = 0;
let attendees = [];

// DOM Elements
const checkInForm = document.getElementById('checkInForm');
const attendeeNameInput = document.getElementById('attendeeName');
const teamSelect = document.getElementById('teamSelect');
const attendeeCountSpan = document.getElementById('attendeeCount');
const maxAttendeeCountSpan = document.getElementById('maxAttendeeCount');
const progressBar = document.getElementById('progressBar');
const greetingParagraph = document.getElementById('greeting');
const waterCountSpan = document.getElementById('waterCount');
const zeroCountSpan = document.getElementById('zeroCount');
const powerCountSpan = document.getElementById('powerCount');

// LevelUp Extra Credit DOM Elements
const celebrationBox = document.getElementById('celebrationBox');
const celebrationMessage = document.getElementById('celebrationMessage');
const attendeeList = document.getElementById('attendeeList');
const attendeeListCount = document.getElementById('attendeeListCount');
const attendeeEmptyState = document.getElementById('attendeeEmptyState');
const resetDataBtn = document.getElementById('resetDataBtn');

// Helper function to get team details
function getTeamDetails(teamValue) {
  if (teamValue === 'water') {
    return {
      label: 'Team Water Wise',
      icon: '🌊',
      cssClass: 'water'
    };
  } else if (teamValue === 'zero') {
    return {
      label: 'Team Net Zero',
      icon: '🌿',
      cssClass: 'zero'
    };
  } else if (teamValue === 'power') {
    return {
      label: 'Team Renewables',
      icon: '⚡',
      cssClass: 'power'
    };
  }
  return {
    label: 'Intel Team',
    icon: '🌱',
    cssClass: 'water'
  };
}

// Save all progress to localStorage (LevelUp: 10 pts)
function saveProgress() {
  const dataToSave = {
    totalAttendees: totalAttendees,
    waterCount: waterCount,
    zeroCount: zeroCount,
    powerCount: powerCount,
    attendees: attendees
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

// Render the attendee list (LevelUp: 10 pts)
function renderAttendeeList() {
  attendeeList.innerHTML = '';
  attendeeListCount.textContent = attendees.length;

  if (attendees.length === 0) {
    attendeeEmptyState.style.display = 'block';
    return;
  }

  attendeeEmptyState.style.display = 'none';

  // Render each attendee
  for (let i = 0; i < attendees.length; i = i + 1) {
    const attendee = attendees[i];
    const teamInfo = getTeamDetails(attendee.team);

    const listItem = document.createElement('li');
    listItem.className = 'attendee-card';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'attendee-info';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'attendee-avatar';
    avatarDiv.textContent = attendee.name.charAt(0).toUpperCase();

    const nameSpan = document.createElement('span');
    nameSpan.className = 'attendee-name';
    nameSpan.textContent = attendee.name;

    infoDiv.appendChild(avatarDiv);
    infoDiv.appendChild(nameSpan);

    const badgeSpan = document.createElement('span');
    badgeSpan.className = `team-badge ${teamInfo.cssClass}`;
    badgeSpan.textContent = `${teamInfo.icon} ${teamInfo.label}`;

    listItem.appendChild(infoDiv);
    listItem.appendChild(badgeSpan);

    // Prepend so latest attendee appears at the top
    if (attendeeList.firstChild) {
      attendeeList.insertBefore(listItem, attendeeList.firstChild);
    } else {
      attendeeList.appendChild(listItem);
    }
  }
}

// Check and display celebration feature (LevelUp: 5 pts)
function checkCelebration() {
  if (totalAttendees >= MAX_ATTENDEES) {
    let winningMessage = '';

    // Determine the winning team(s) with highest turnout
    const maxTeamCount = Math.max(waterCount, zeroCount, powerCount);
    const topTeams = [];

    if (waterCount === maxTeamCount) {
      topTeams.push('🌊 Team Water Wise');
    }
    if (zeroCount === maxTeamCount) {
      topTeams.push('🌿 Team Net Zero');
    }
    if (powerCount === maxTeamCount) {
      topTeams.push('⚡ Team Renewables');
    }

    if (topTeams.length === 1) {
      winningMessage = `🎉 Goal reached! Huge congratulations to <span class="winning-team-highlight">${topTeams[0]}</span> for winning the competition with ${maxTeamCount} attendees!`;
    } else if (topTeams.length === 2) {
      winningMessage = `🎉 Goal reached! It is a tie between <span class="winning-team-highlight">${topTeams[0]}</span> and <span class="winning-team-highlight">${topTeams[1]}</span> with ${maxTeamCount} attendees each!`;
    } else {
      winningMessage = `🎉 Goal reached! Incredible teamwork! All three teams are tied with ${maxTeamCount} attendees each!`;
    }

    celebrationMessage.innerHTML = winningMessage;
    celebrationBox.style.display = 'block';
  } else {
    celebrationBox.style.display = 'none';
  }
}

// Update the progress bar width based on current attendance
function updateProgressBar() {
  const percentage = Math.min((totalAttendees / MAX_ATTENDEES) * 100, 100);
  progressBar.style.width = `${percentage}%`;
}

// Update count displays on the page
function updateCountDisplays() {
  attendeeCountSpan.textContent = totalAttendees;
  if (maxAttendeeCountSpan) {
    maxAttendeeCountSpan.textContent = MAX_ATTENDEES;
  }
  waterCountSpan.textContent = waterCount;
  zeroCountSpan.textContent = zeroCount;
  powerCountSpan.textContent = powerCount;
  updateProgressBar();
  checkCelebration();
}

// Load saved data from localStorage on startup (LevelUp: 10 pts)
function loadSavedProgress() {
  const savedDataString = localStorage.getItem(STORAGE_KEY);
  if (!savedDataString) {
    return;
  }

  try {
    const savedData = JSON.parse(savedDataString);
    if (savedData) {
      totalAttendees = savedData.totalAttendees || 0;
      waterCount = savedData.waterCount || 0;
      zeroCount = savedData.zeroCount || 0;
      powerCount = savedData.powerCount || 0;
      attendees = savedData.attendees || [];

      updateCountDisplays();
      renderAttendeeList();
    }
  } catch (error) {
    console.error('Could not load saved progress:', error);
  }
}

// Reset all attendance data
function resetAllData() {
  totalAttendees = 0;
  waterCount = 0;
  zeroCount = 0;
  powerCount = 0;
  attendees = [];

  localStorage.removeItem(STORAGE_KEY);

  updateCountDisplays();
  renderAttendeeList();

  greetingParagraph.style.display = 'none';
  celebrationBox.style.display = 'none';
}

// Handle attendee check-in form submission
function handleCheckIn(event) {
  event.preventDefault();

  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;
  const teamInfo = getTeamDetails(selectedTeam);

  if (!attendeeName || !selectedTeam) {
    return;
  }

  // 1. Increment total attendees
  totalAttendees = totalAttendees + 1;

  // 2. Increment selected team count
  if (selectedTeam === 'water') {
    waterCount = waterCount + 1;
  } else if (selectedTeam === 'zero') {
    zeroCount = zeroCount + 1;
  } else if (selectedTeam === 'power') {
    powerCount = powerCount + 1;
  }

  // 3. Update count displays and progress bar
  updateCountDisplays();

  // 4. Personalized greeting message
  greetingParagraph.textContent = `Welcome, ${attendeeName}! Thank you for checking in with ${teamInfo.label}.`;
  greetingParagraph.className = 'success-message';
  greetingParagraph.style.display = 'block';

  // 5. Add attendee to the list
  const newAttendee = {
    name: attendeeName,
    team: selectedTeam,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  attendees.push(newAttendee);
  renderAttendeeList();

  // 6. Save updated data to localStorage
  saveProgress();

  // 7. Clear the form for the next attendee
  checkInForm.reset();
}

// Event Listeners
checkInForm.addEventListener('submit', handleCheckIn);

if (resetDataBtn) {
  resetDataBtn.addEventListener('click', resetAllData);
}

// Initialize on page load
updateCountDisplays();
loadSavedProgress();
