document.addEventListener('DOMContentLoaded', function() {
    const categories = {
        'Arms': ['Bicep Curl', 'Tricep Extension'],
        'Chest': ['Bench Press', 'Incline Bench Press', 'Flys'],
        'Legs': ['Squats', 'Leg Press', 'Lunges'],
        'Shoulders': ['Shoulder Press', 'Lateral Raises'],
        'Back': ['Pull Ups', 'Deadlift'],
        'Core': ['Sit-ups', 'Leg Raises']
    };

    let exercises = {};

    function initializeExercises() {
        for (const [category, exercisesList] of Object.entries(categories)) {
            exercisesList.forEach(exercise => {
                if (!exercises[exercise]) {
                    exercises[exercise] = { sets: [] };
                }
            });
        }
    }

    function loadExercises() {
        const storedExercises = JSON.parse(localStorage.getItem('exercises'));
        if (storedExercises) {
            exercises = { ...exercises, ...storedExercises };
        }
    }

    function saveExercises() {
        localStorage.setItem('exercises', JSON.stringify(exercises));
    }

    function updateExercise(exerciseName) {
        const setsContainer = document.getElementById(`sets-container-${exerciseName}`);
        const newSetData = Array.from(setsContainer.children).map(setDiv => {
            const weight = setDiv.querySelector(`input[id^="weight"]`).value;
            const reps = setDiv.querySelector(`input[id^="reps"]`).value;
            return { weight, reps };
        });

        exercises[exerciseName].sets.push({ date: new Date().toLocaleDateString(), data: newSetData });
        saveExercises();
        displayHistory(exerciseName);
    }

    function displayHistory(exerciseName) {
        const historyDiv = document.getElementById(`history-${exerciseName}`);
        historyDiv.innerHTML = '<h4>History:</h4>';
        exercises[exerciseName].sets.forEach((setEntry, index) => {
            let entryHTML = `<div class="history-entry"><span>${setEntry.date}: `;
            setEntry.data.forEach((set, setIndex) => {
                entryHTML += `Set ${setIndex + 1} - ${set.weight} lbs, ${set.reps} reps; `;
            });
            entryHTML += `</span><button class="delete-btn" onclick="deleteEntry('${exerciseName}', ${index})">X</button></div>`;
            historyDiv.innerHTML += entryHTML;
        });
    }
    
    

    function deleteEntry(exerciseName, entryIndex) {
        exercises[exerciseName].sets.splice(entryIndex, 1);
        saveExercises();
        displayHistory(exerciseName);
    }

    function addSet(exerciseName) {
        const container = document.getElementById(`sets-container-${exerciseName}`);
        createSetInputs(container, exerciseName, container.children.length + 1);
    }

    function createSetInputs(container, exerciseName, setNumber) {
        const setDiv = document.createElement('div');
        setDiv.id = `set-${exerciseName}-${setNumber}`;
        setDiv.innerHTML = `
            <h4>Set ${setNumber}</h4>
            <input type="number" placeholder="Weight (lbs)" id="weight-${exerciseName}-${setNumber}">
            <input type="number" placeholder="Reps" id="reps-${exerciseName}-${setNumber}">
            <button onclick="deleteSet('${exerciseName}', ${setNumber})">Delete Set</button>
        `;
        container.appendChild(setDiv);
    }

    function deleteSet(exerciseName, setNumber) {
        const setDiv = document.getElementById(`set-${exerciseName}-${setNumber}`);
        setDiv.parentNode.removeChild(setDiv);
    }

    function renderCategories() {
        const container = document.getElementById('exercise-container');
        container.innerHTML = '<h2>Select a Body Part</h2>';
        Object.keys(categories).forEach(category => {
            const categoryButton = document.createElement('button');
            categoryButton.innerText = category;
            categoryButton.onclick = function() { renderExercises(category); };
            container.appendChild(categoryButton);
        });
    }

    function renderExercises(category) {
        const container = document.getElementById('exercise-container');
        container.innerHTML = `<h2>${category} Exercises</h2>`;
        categories[category].forEach(exercise => {
            const exerciseButton = document.createElement('button');
            exerciseButton.innerText = exercise;
            exerciseButton.onclick = function() { renderExerciseDetails(exercise, category); };
            container.appendChild(exerciseButton);
        });
        const backButton = document.createElement('button');
        backButton.innerText = 'Back to Categories';
        backButton.onclick = renderCategories;
        container.appendChild(backButton);
    }

    function renderExerciseDetails(exerciseName, category) {
        const container = document.getElementById('exercise-container');
        container.innerHTML = `
            <h3>${exerciseName}</h3>
            <div id="sets-container-${exerciseName}"></div>
            <button onclick="addSet('${exerciseName}')">Add Set</button>
            <button onclick="updateExercise('${exerciseName}')">Save Exercise</button>
            <div id="history-${exerciseName}" class="history"></div>
            <button onclick="renderExercises('${category}')">Back to Exercises</button>
        `;
        addSet(exerciseName); // Add first set by default
        displayHistory(exerciseName);
    }

    window.updateExercise = updateExercise;
    window.deleteEntry = deleteEntry;
    window.addSet = addSet;
    window.deleteSet = deleteSet;
    window.renderExercises = renderExercises;


    initializeExercises();
    loadExercises();
    renderCategories();
});
