// DOM elements को प्राप्त करें
const noteText = document.getElementById('noteText');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesContainer = document.getElementById('notesContainer');

// नोट्स को स्टोर करने के लिए एक अरे (array)
let notes = [];

// --- फंक्शन्स ---

// 1. लोकल स्टोरेज से नोट्स लोड करें
function loadNotes() {
    const storedNotes = localStorage.getItem('notesAppNotes');
    if (storedNotes) {
        notes = JSON.parse(storedNotes); // JSON स्ट्रिंग को वापस अरे में बदलें
        renderNotes(); // UI पर नोट्स दिखाएं
    }
}

// 2. नोट्स को लोकल स्टोरेज में सहेजें
function saveNotes() {
    localStorage.setItem('notesAppNotes', JSON.stringify(notes)); // अरे को JSON स्ट्रिंग में बदलकर सहेजें
}

// 3. UI पर सभी नोट्स को रेंडर करें
function renderNotes() {
    notesContainer.innerHTML = ''; // कंटेनर को पहले खाली करें

    if (notes.length === 0) {
        notesContainer.innerHTML = '<p class="no-notes-message">कोई नोट्स नहीं हैं। नया नोट जोड़ने के लिए ऊपर लिखें!</p>';
        return;
    }

    notes.forEach((note, index) => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        noteCard.setAttribute('data-index', index); // इंडेक्स को डेटा एट्रिब्यूट के रूप में स्टोर करें

        noteCard.innerHTML = `
            <div class="note-text" contenteditable="true">${note}</div>
            <div class="note-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // एडिट बटन पर क्लिक इवेंट लिसनर
        const editBtn = noteCard.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => editNote(index, noteCard.querySelector('.note-text')));

        // डिलीट बटन पर क्लिक इवेंट लिसनर
        const deleteBtn = noteCard.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteNote(index));

        notesContainer.appendChild(noteCard);
    });
}

// 4. नया नोट जोड़ें
function addNote() {
    const newNoteText = noteText.value.trim(); // टेक्स्ट एरिया से वैल्यू लें और खाली स्पेस हटाएं

    if (newNoteText) { // अगर टेक्स्ट खाली नहीं है
        notes.push(newNoteText); // अरे में नया नोट जोड़ें
        saveNotes(); // लोकल स्टोरेज में सहेजें
        renderNotes(); // UI को अपडेट करें
        noteText.value = ''; // टेक्स्ट एरिया को खाली करें
    } else {
        alert('कृपया नोट में कुछ लिखें!'); // खाली नोट के लिए अलर्ट
    }
}

// 5. मौजूदा नोट को संपादित करें
function editNote(index, noteTextElement) {
    // contenteditable="true" विशेषता का उपयोग नोट टेक्स्ट को सीधे UI में संपादन योग्य बनाने के लिए
    // 'Edit' बटन को 'Save' बटन में बदलें
    const editBtn = noteTextElement.nextElementSibling.querySelector('.edit-btn');
    editBtn.textContent = 'Save';
    editBtn.classList.remove('edit-btn');
    editBtn.classList.add('save-btn'); // एक नया क्लास जोड़ें

    // फोकस करें और कर्सर को टेक्स्ट के अंत में ले जाएं
    noteTextElement.focus();
    const range = document.createRange();
    range.selectNodeContents(noteTextElement);
    range.collapse(false); // कर्सर को अंत में रखें
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // 'Save' बटन पर क्लिक लिसनर
    editBtn.onclick = () => {
        const updatedText = noteTextElement.textContent.trim();
        if (updatedText) {
            notes[index] = updatedText; // अरे में नोट अपडेट करें
            saveNotes(); // लोकल स्टोरेज में सहेजें
            renderNotes(); // UI को फिर से रेंडर करें
        } else {
            alert('नोट खाली नहीं हो सकता!');
            // अगर खाली हो जाता है, तो मूल नोट को बहाल करने के लिए री-रेंडर करें
            renderNotes();
        }
    };
}


// 6. नोट को हटाएँ
function deleteNote(index) {
    if (confirm('क्या आप वाकई इस नोट को हटाना चाहते हैं?')) { // पुष्टि संवाद
        notes.splice(index, 1); // अरे से नोट हटाएँ
        saveNotes(); // लोकल स्टोरेज में सहेजें
        renderNotes(); // UI को अपडेट करें
    }
}

// --- इवेंट लिसनर ---

// 'Add Note' बटन पर क्लिक करने पर नया नोट जोड़ें
addNoteBtn.addEventListener('click', addNote);

// पेज लोड होने पर नोट्स लोड करें
document.addEventListener('DOMContentLoaded', loadNotes);


