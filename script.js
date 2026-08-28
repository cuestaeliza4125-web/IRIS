/* ============================================================
  GLOBAL VARIABLES
============================================================ */
console.log("PART 1 LOADED: E-Library Home - Laptop");

/* ---------- 1.1 INTERFACE VARIABLES ---------- */
let isDark = false; let currentSize = 100; let speechTimeout;

/* ---------- 1.2 READER VARIABLES ---------- */
let currentBook = ''; let currentPage = 0; let currentFontSize = 18; const minFontSize = 14; const maxFontSize = 28;

/* ---------- 1.3 VOICE VARIABLES ---------- */
let voiceMale = null; let voiceFemale = null; let selectedVoice = null; let currentGender = 'female'; let currentRate = 1.0;
let voicesList = []; let voicesLoaded = false; let currentUtterance = null; let previewUtterance = null;

/* ============================================================
  PAGE 1. E-LIBRARY
============================================================ */
/* ------------------------------------------------------------
   FUNCTIONS
------------------------------------------------------------ */
/* ---------- PAGE NAVIGATION ---------- */
    function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active'); }

   /* ---------- LEFT SIDE ---------- */
/* Dark Mode */
   function toggleDarkMode() {
   const darkModeBtn = document.getElementById('darkModeBtn'); isDark = !isDark;
   document.body.classList.toggle('dark-mode');
   if (darkModeBtn) { darkModeBtn.textContent = isDark ? 'LIGHTMODE' : 'DARKMODE'; } }
/* Fullscreen */
   function toggleFullscreen() { const fullscreenBtn = document.getElementById('fullscreenBtn');
   if (!document.fullscreenElement) { document.documentElement.requestFullscreen();
   if (fullscreenBtn) { fullscreenBtn.textContent = 'EXIT FULLSCREEN'; } } else { document.exitFullscreen();
   if (fullscreenBtn) { fullscreenBtn.textContent = 'FULLSCREEN'; } } }

/* ---------- RIGHT SIDE ---------- */
/* Text Size Increase */
   function increaseText() {
   if (currentSize < 120) { currentSize += 10; currentFontSize = Math.round((currentSize - 80) / 10) * 2 + 14;
   updateScale();
   localStorage.setItem("libraryScale", currentSize);localStorage.setItem("readerFontSize", currentFontSize);
   if (currentBook) { loadPage(currentBook, currentPage); } } }
/* Text Size Decrease */
   function decreaseText() {
   if (currentSize > 80) { currentSize -= 10; currentFontSize = Math.round((currentSize - 80) / 10) * 2 + 14;
   updateScale();
   localStorage.setItem("libraryScale", currentSize); localStorage.setItem("readerFontSize", currentFontSize);
   if (currentBook) { loadPage(currentBook, currentPage); } } }

/* Update Book Scale */
function updateScale() {
document.querySelectorAll('.book-item p').forEach(el => { el.style.fontSize = currentSize + '%'; });
document.querySelectorAll('.book-item img').forEach(img => {
img.style.width = (240 * currentSize / 100) + 'px'; img.style.height = (340 * currentSize / 100) + 'px'; }); }

/* Open Book Poster */
function openBook(bookName) { console.log("Opening book:", bookName);
const container = document.querySelector('.book-container'); const controls = document.querySelector('.controls-wrapper');
if (container) container.style.opacity = 0; if (controls) controls.style.opacity = 0;
setTimeout(() => { showPage(bookName + '-poster'); }, 300); }

/* Book Selection */
document.querySelectorAll('.book-item').forEach(book => {
book.addEventListener('click', () => { openBook(book.dataset.book); }); });

/* ==========================================
   LIBRARY SEARCH
========================================== */
const searchToggleBtn = document.getElementById("searchToggleBtn");
const librarySearch = document.querySelector(".library-search");
const bookSearch = document.getElementById("bookSearch");

searchToggleBtn.addEventListener("click", (e) => { e.stopPropagation(); librarySearch.classList.toggle("active");
if ( librarySearch.classList.contains("active")){ setTimeout(()=>{ bookSearch.focus(); },250); }
else { bookSearch.value=""; }}); document.addEventListener("click",(e)=>{
if(!librarySearch.contains(e.target)){ librarySearch.classList.remove("active"); bookSearch.value=""; } });
document.addEventListener("keydown",(e)=>{
if(document.activeElement === bookSearch) return; if( e.key.length === 1 && !e.ctrlKey && !e.altKey ){

librarySearch.classList.add("active"); setTimeout(()=>{ bookSearch.focus(); bookSearch.value = e.key; },150); } });

/* ------------------------------------------------------------
   EVENT LISTENERS
------------------------------------------------------------ */
/* ---------- LEFT SIDE BUTTONS ---------- */
/* Dark Mode Button */
   const darkModeBtn = document.getElementById('darkModeBtn');
   if (darkModeBtn) { darkModeBtn.addEventListener('click', toggleDarkMode); }
/* Fullscreen Button */
   const fullscreenBtn = document.getElementById('fullscreenBtn');
   if (fullscreenBtn) { fullscreenBtn.addEventListener('click', toggleFullscreen); }
/* Fullscreen Change */
   document.addEventListener('fullscreenchange', () => {
   if (fullscreenBtn && !document.fullscreenElement) { fullscreenBtn.textContent = 'FULLSCREEN'; } });

/* ---------- RIGHT SIDE BUTTONS ---------- */
/* Text Increase */
   const textIncrease = document.getElementById('textIncrease');
   if (textIncrease) { textIncrease.addEventListener('click', increaseText); }
/* Text Decrease */
   const textDecrease = document.getElementById('textDecrease');
   if (textDecrease) { textDecrease.addEventListener('click', decreaseText); }
/* Voice Popup */
   const voiceIconBtn = document.getElementById('voiceIconBtn');
   const voicePopup = document.getElementById('voicePopup');
   const currentVoiceIcon = document.getElementById('currentVoiceIcon');
   if (voiceIconBtn && voicePopup) { voiceIconBtn.addEventListener('click', () => { voicePopup.classList.toggle('hidden'); });
   document.addEventListener('click', (e) => {
   if ( !voiceIconBtn.contains(e.target) && !voicePopup.contains(e.target) ) { voicePopup.classList.add('hidden'); } }); }
/* Voice Selection */
   document.querySelectorAll('.voice-list button').forEach(btn => { btn.addEventListener('click', () => {
   selectedGender = btn.getAttribute('data-gender');
   if (currentVoiceIcon) { if (selectedGender === 'male') {
   currentVoiceIcon.className = 'gender-badge male'; currentVoiceIcon.textContent = '👨';
   } else {
   currentVoiceIcon.className = 'gender-badge female'; currentVoiceIcon.textContent = '👩'; } }
   if (voicePopup) { voicePopup.classList.add('hidden'); } }); });
/* Speed Slider */
   const speedSlider = document.getElementById('speedSlider'); const speedValue = document.getElementById('speedValue');
   if (speedSlider && speedValue) { speedSlider.addEventListener('input', () => { currentRate = speedSlider.value;
   speedValue.textContent = currentRate + 'x'; clearTimeout(speechTimeout); speechTimeout = setTimeout(() => {
   if (voicesLoaded) { speakSample('Voice speed test'); } }, 200); }); }

/* ---------- KEYBOARD SHORTCUTS ---------- */
document.addEventListener('keydown', (e) => {
if (e.target.tagName === 'INPUT') return; if (e.key.toLowerCase() === 'd') { toggleDarkMode(); }
if (e.key.toLowerCase() === 'f') { toggleFullscreen(); }
if (e.key === 'Escape' && document.fullscreenElement) { toggleFullscreen(); }
if (e.key === '+') { increaseText(); } if (e.key === '-') { decreaseText(); } });

/* ============================================================
  PAGE 2. COVER PAGE
============================================================ */
/* ------------------------------------------------------------
   FUNCTIONS
------------------------------------------------------------ */
/* Open Book Poster */
   function openBook(bookName) { console.log("Opening book:", bookName);
   const container = document.querySelector('.book-container'); const controls = document.querySelector('.controls-wrapper');
   if (container) container.style.opacity = 0; if (controls) controls.style.opacity = 0;
   setTimeout(() => { showPage(bookName + '-poster'); }, 300); }

/* ------------------------------------------------------------
   EVENT LISTENERS
------------------------------------------------------------ */
/* Back Button */
   document.querySelectorAll('.back-btn').forEach(btn => { btn.addEventListener('click', () => { showPage('library-page');
   const container = document.querySelector('.book-container'); const controls = document.querySelector('.controls-wrapper');
   if (container) container.style.opacity = 1; if (controls) controls.style.opacity = 1; }); });

/* Start Reading */
   document.querySelectorAll('.start-reading').forEach(btn => { btn.addEventListener('click', () => {
   let bookName = btn.dataset.book; currentBook = bookName; const savedPage = localStorage.getItem("bookmark_" + bookName);

currentPage = savedPage !== null ? parseInt(savedPage) : 0;

showPage(bookName + '-reader');

setTimeout(() => {
    loadPage(bookName, currentPage);
}, 100); }); });


/* ============================================================
  PAGE 3. READERS PAGE
============================================================ */
/* ------------------------------------------------------------
   FUNCTIONS
------------------------------------------------------------ */
/* ---------- LOAD PAGE ---------- */
function loadPage(book, pageNum) {
console.log("Book:", book); console.log("Pages ng book:", bookPages); console.log("Page num:", pageNum);
currentBook = book; currentPage = pageNum;
const idSuffix = book.charAt(0).toUpperCase() + book.slice(1);
const textArea = document.getElementById("readerText" + idSuffix);
const prevBtn = document.getElementById("prevPageBtn" + idSuffix);
const nextBtn = document.getElementById("nextPageBtn" + idSuffix);
const pages = bookPages[book];
if (!pages) return; const totalPages = pages.length;
const pageIndicator = document.getElementById("pageIndicator" + idSuffix);

if (pageIndicator) {
    pageIndicator.textContent = `${pageNum + 1} / ${totalPages}`;
}
if (textArea) { textArea.innerHTML = "<span class='readerText'>" + pages[pageNum] + "</span>";
const text = document.getElementById("TESTTEXT"); 
if (text) { text.style.fontSize = currentFontSize + "px"; text.style.lineHeight = "1.8";
text.style.color = document.body.classList.contains("dark-mode") ? "#eee" : "#222"; } }
if (prevBtn) { prevBtn.disabled = (pageNum === 0); prevBtn.style.opacity = (pageNum === 0) ? "0.4" : "1"; }
if (nextBtn) { nextBtn.disabled = (pageNum === totalPages - 1);
nextBtn.style.opacity = (pageNum === totalPages - 1) ? "0.4" : "1"; } }

/* ---------- FONT SIZE ---------- */
function goHome() { const library = document.getElementById('library'); const reader = document.getElementById('reader');
if (library) library.style.display = 'block'; if (reader) reader.style.display = 'none'; }

/* ------------------------------------------------------------
   HEADER
------------------------------------------------------------ */
/* ---------- BACK ---------- */
   document.querySelectorAll('.reader-back').forEach(btn => { btn.addEventListener('click', () => {
   let currentReader = btn.closest('.page').id; let bookName = currentReader.replace('-reader', '');
   showPage(bookName + '-poster'); }); });

/* ---------- READ ALOUD ---------- */
   document.querySelectorAll('[id^="readAloudBtn"]').forEach(btn => { btn.addEventListener('click', () => {
   if (currentBook && bookPages[currentBook]) { let text = bookPages[currentBook][currentPage]; speak(text); } }); });

/* ------------------------------------------------------------
   FOOTER
------------------------------------------------------------ */
function setupAllBookButtons() {
const books = ['emily', 'hour', 'stars', 'magi']; books.forEach(book => {
const suffix = book.charAt(0).toUpperCase() + book.slice(1);
const prevBtn = document.getElementById('prevPageBtn' + suffix);
const nextBtn = document.getElementById('nextPageBtn' + suffix);
if (prevBtn && nextBtn) {

/* ---------- PREVIOUS ---------- */
/* setupAllBookButtons() ang may hawak ng Previous Button */
   prevBtn.onclick = function () { if (currentPage > 0) { loadPage(currentBook, currentPage - 1); } }
/* ---------- NEXT ---------- */
/* setupAllBookButtons() ang may hawak ng Next Button */
   nextBtn.onclick = function () { const totalPages = bookPages[currentBook].length;
   if (currentPage < totalPages - 1) { loadPage(currentBook, currentPage + 1); } }; } }); }

/* ---------- FONT BUTTONS ---------- */
function setupFontButtons() {
const books = ["Emily", "Stars", "Hour", "Magi"]; books.forEach(name => {
const plus = document.getElementById("increaseFontBtn" + name);
const minus = document.getElementById("decreaseFontBtn" + name);
if (plus) { plus.onclick = function () { if (currentFontSize < maxFontSize) { currentFontSize += 2; }
const text = document.getElementById("readerText" + name);
if (text) { text.style.fontSize = currentFontSize + "px"; } }; }
if (minus) { minus.onclick = function () {
if (currentFontSize > minFontSize) { currentFontSize -= 2; }
const text = document.getElementById("readerText" + name);
if (text) { text.style.fontSize = currentFontSize + "px"; } }; } }); }

/* ---------- KEYBOARD FONT +/- ---------- */
document.addEventListener('keydown', (e) => {
if (e.key === '+' || e.key === '=') { if (currentFontSize < maxFontSize) { currentFontSize += 2;
const idSuffix = currentBook.charAt(0).toUpperCase() + currentBook.slice(1);
const textArea = document.getElementById('readerText' + idSuffix);
if (textArea) { textArea.style.fontSize = currentFontSize + 'px'; } } }
if (e.key === '-' || e.key === '_') { if (currentFontSize > minFontSize) { currentFontSize -= 2;
const idSuffix = currentBook.charAt(0).toUpperCase() + currentBook.slice(1);
const textArea = document.getElementById('readerText' + idSuffix);
if (textArea) { textArea.style.fontSize = currentFontSize + 'px'; } } } });

/* ============================================================
  PART 1. BOOK DATA
============================================================ */
/* ------------------------------------------------------------
   BOOK PAGES
------------------------------------------------------------ */
const bookPages = {
  'emily': [
  `WHEN Miss Emily Grierson died, our whole town went to her funeral: the men through a sort of respectful affection for a fallen monument, the women mostly out of curiosity to see the inside of her house, which no one save an old man-servant — a combined gardener and cook — had seen in at least ten years.
    
  It was a big, <span class="vocab-word" data-word="squarish">squarish</span> frame house that had once been white, decorated with <span class="vocab-word" data-word="cupolas">cupolas</span> and <span class="vocab-word" data-word="spires">spires</span> and scrolled balconies in the heavily lightsome style of the seventies, set on what had once been our most select street. But garages and cotton gins had <span class="vocab-word" data-word="encroached">encroached</span> and <span class="vocab-word" data-word="obliterated">obliterated</span> even the <span class="vocab-word" data-word="august">august</span> names of that neighborhood; only Miss Emily’s house was left, lifting its stubborn and coquettish decay above the cotton wagons and the gasoline pumps-an eyesore among eyesores. And now Miss Emily had gone to join the representatives of those august names where they lay in the cedar-bemused cemetery among the ranked and anonymous graves of Union and Confederate soldiers who fell at the battle of Jefferson.

  Alive, Miss Emily had been a tradition, a duty, and a care; a sort of hereditary obligation upon the town, dating from that day in 1894 when Colonel Sartoris, the mayor — he who fathered the <span class="vocab-word" data-word="edict">edict</span> that no Negro woman should appear on the streets without an apron-remitted her taxes, the dispensation dating from the death of her father on into <span class="vocab-word" data-word="perpetuity">perpetuity</span>. Not that Miss Emily would have accepted charity. Colonel Sartoris invented an involved tale to the effect that Miss Emily’s father had loaned money to the town, which the town, as a matter of business, preferred this way of repaying. Only a man of Colonel Sartoris’ generation and thought could have invented it, and only a woman could have believed it.
   
  When the next generation, with its more modern ideas, became mayors and <span class="vocab-word" data-word="aldermen">aldermen</span>, this arrangement created some little dissatisfaction. On the first of the year they mailed her a tax notice. February came, and there was no reply. They wrote her a formal letter, asking her to call at the sheriff’s office at her convenience. A week later the mayor wrote her himself, offering to call or to send his car for her, and received in reply a note on paper of an <span class="vocab-word" data-word="archaic">archaic</span> shape, in a thin, flowing calligraphy in faded ink, to the effect that she no longer went out at all. The tax notice was also enclosed, without comment.`,
  `They called a special meeting of the Board of Aldermen. A deputation waited upon her, knocked at the door through which no visitor had passed since she ceased giving china-painting lessons eight or ten years earlier. They were admitted by the old Negro into a dim hall from which a stairway mounted into still more shadow. It smelled of dust and disuse — a close, <span class="vocab-word" data-word="dank">dank</span> smell. The Negro led them into the parlor.
    
  It was furnished in heavy, leather-covered furniture. When the Negro opened the blinds of one window, they could see that the leather was cracked; and when they sat down, a faint dust rose <span class="vocab-word" data-word="sluggishly">sluggishly</span> about their thighs, spinning with slow <span class="vocab-word" data-word="motes">motes</span> in the single sun-ray. On a tarnished gilt <span class="vocab-word" data-word="easel">easel</span> before the fireplace stood a crayon portrait of Miss Emily’s father.

  They rose when she entered — a small, fat woman in black, with a thin gold chain descending to her waist and vanishing into her belt, leaning on an <span class="vocab-word" data-word="ebony">ebony</span> cane with a tarnished gold head. Her skeleton was small and spare; perhaps that was why what would have been merely plumpness in another was obesity in her. She looked bloated, like a body long submerged in motionless water, and of that pallid hue. Her eyes, lost in the fatty <span class="vocab-word" data-word="ridges">ridges</span> of her face, looked like two small pieces of coal pressed into a lump of dough as they moved from one face to another while the visitors stated their errand.
  
  She did not ask them to sit. She just stood in the door and listened quietly until the spokesman came to a stumbling halt. Then they could hear the invisible watch ticking at the end of the gold chain.
  
  Her voice was dry and cold. “I have no taxes in Jefferson. Colonel Sartoris explained it to me. Perhaps one of you can gain access to the city records and satisfy yourselves.”`,
  `“But we have. We are the city authorities, Miss Emily. Didn’t you get a notice from the sheriff, signed by him?”

  “I received a paper, yes,” Miss Emily said. “Perhaps he considers himself the sheriff... I have no taxes in Jefferson.”

  “But there is nothing on the books to show that, you see We must go by the —”

  “See Colonel Sartoris. I have no taxes in Jefferson.”

  “But, Miss Emily —”

  “See Colonel Sartoris.” (Colonel Sartoris had been dead almost ten years.) “I have no taxes in Jefferson. Tobe!” The Negro appeared. “Show these gentlemen out.”`,
  `II
  
  SO she <span class="vocab-word" data-word="vanquished">vanquished</span> them, horse and foot, just as she had vanquished their fathers thirty years before about the smell.
  
  That was two years after her father’s death and a short time after her sweetheart — the one we believed would marry her — had deserted her. After her father’s death she went out very little; after her sweetheart went away, people hardly saw her at all. A few of the ladies had the <span class="vocab-word" data-word="temerity">temerity</span> to call, but were not received, and the only sign of life about the place was the Negro man — a young man then — going in and out with a market basket.

  “Just as if a man — any man — could keep a kitchen properly,” the ladies said; so they were not surprised when the smell developed. It was another link between the gross, <span class="vocab-word" data-word="teeming">teeming</span> world and the high and mighty Griersons.
  
  A neighbor, a woman, complained to the mayor, Judge Stevens, eighty years old.
    
  “But what will you have me do about it, madam?” he said.

  “Why, send her word to stop it,” the woman said. “Isn’t there a law?”
  
  A neighbor, a woman, complained to the mayor, Judge Stevens, eighty years old.`,
  `“But what will you have me do about it, madam?” he said.

  “Why, send her word to stop it,” the woman said. “Isn’t there a law?”
  
  “I’m sure that won’t be necessary,” Judge Stevens said. “It’s probably just a snake or a rat that nigger of hers killed in the yard. I’ll speak to him about it.”

  The next day he received two more complaints, one from a man who came in diffident <span class="vocab-word" data-word="deprecation">deprecation</span>. “We really must do something about it, Judge. I’d be the last one in the world to bother Miss Emily, but we’ve got to do something.” That night the Board of Aldermen met — three graybeards and one younger man, a member of the rising generation.
  
  “It’s simple enough,” he said. “Send her word to have her place cleaned up. Give her a certain time to do it in, and if she don’t...”

  “Dammit, sir,” Judge Stevens said, “will you accuse a lady to her face of smelling bad?”
  
  So the next night, after midnight, four men crossed Miss Emily’s lawn and slunk about the house like <span class="vocab-word" data-word="burglars">burglars</span>, sniffing along the base of the brickwork and at the cellar openings while one of them performed a regular sowing motion with his hand out of a sack slung from his shoulder. They broke open the cellar door and sprinkled lime there, and in all the outbuildings. As they recrossed the lawn, a window that had been dark was lighted and Miss Emily sat in it, the light behind her, and her upright torso motionless as that of an idol. They crept quietly across the lawn and into the shadow of the locusts that lined the street. After a week or two the smell went away.`,
  `That was when people had begun to feel really sorry for her. People in our town, remembering how old lady Wyatt, her great-aunt, had gone completely crazy at last, believed that the Griersons held themselves a little too high for what they really were. None of the young men were quite good enough for Miss Emily and such. We had long thought of them as a tableau, Miss Emily a slender figure in white in the background, her father a <span class="vocab-word" data-word="spraddled">spraddled</span> silhouette in the foreground, his back to her and clutching a horsewhip, the two of them framed by the back-flung front door. So when she got to be thirty and was still single, we were not pleased exactly, but <span class="vocab-word" data-word="vindicated">vindicated</span>; even with insanity in the family she wouldn’t have turned down all of her chances if they had really materialized.
    
  When her father died, it got about that the house was all that was left to her; and in a way, people were glad. At last they could pity Miss Emily. Being left alone, and a <span class="vocab-word" data-word="pauper">pauper</span>, she had become humanized. Now she too would know the old thrill and the old despair of a penny more or less.

  The day after his death all the ladies prepared to call at the house and offer condolence and aid, as is our custom Miss Emily met them at the door, dressed as usual and with no trace of grief on her face. She told them that her father was not dead. She did that for three days, with the ministers calling on her, and the doctors, trying to persuade her to let them dispose of the body. Just as they were about to resort to law and force, she broke down, and they buried her father quickly.

  We did not say she was crazy then. We believed she had to do that. We remembered all the young men her father had driven away, and we knew that with nothing left, she would have to cling to that which had robbed her, as people will.`,
  `III
  
  SHE was sick for a long time. When we saw her again, her hair was cut short, making her look like a girl, with a <span class="vocab-word" data-word="vague">vague</span> resemblance to those angels in colored church windows —
  sort of tragic and <span class="vocab-word" data-word="serene">serene</span>.

  The town had just let the contracts for paving the sidewalks, and in the summer after her father’s death they began the work. The construction company came with niggers and mules and machinery, and a foreman named Homer Barron, a Yankee — a big, dark, ready man, with a big voice and eyes lighter than his face. The little boys would follow in groups to hear him cuss the niggers, and the niggers singing in time to the rise and fall of picks. Pretty soon he knew everybody in town. Whenever you heard a lot of laughing anywhere about the square, Homer Barron would be in the center of the group. Presently we began to see him and Miss Emily on Sunday afternoons driving in the yellow-wheeled <span class="vocab-word" data-word="buggy">buggy</span> and the matched team of bays from the livery stable.

  At first we were glad that Miss Emily would have an interest, because the ladies all said, “Of course a Grierson would not think seriously of a Northerner, a day laborer.”
  But there were still others, older people, who said that even grief could not cause a real lady to forget noblesse oblige — without calling it <span class="vocab-word" data-word="noblesse oblige">noblesse oblige</span>.
  They just said, “Poor Emily. Her kinsfolk should come to her.” She had some kin in Alabama; but years ago her father had fallen out with them over the estate of old lady Wyatt, the crazy woman, and there was no communication between the two families. They had not even been represented at the funeral.

  And as soon as the old people said, “Poor Emily,” the whispering began. “Do you suppose it’s really so?” they said to one another. “Of course it is. What else could...”
  This behind their hands; <span class="vocab-word" data-word="rustling">rustling</span> of craned silk and satin behind jalousies closed upon the sun of Sunday afternoon as the thin, swift clop-clop-clop of the matched team passed: “Poor Emily.”`,
  `She carried her head high enough — even when we believed that she was fallen. It was as if she demanded more than ever the recognition of her dignity as the last Grierson; as if it had wanted that touch of earthiness to reaffirm her <span class="vocab-word" data-word="imperviousness">imperviousness</span>. Like when she bought the rat poison, the arsenic. That was over a year after they had begun to say “Poor Emily,” and while the two female cousins were visiting her.

  “I want some poison,” she said to the druggist. She was over thirty then, still a slight woman, though thinner than usual, with cold, haughty black eyes in a face the flesh of which was strained across the temples and about the eyesockets as you imagine a lighthouse-keeper’s face ought to look. “I want some poison,” she said.

  “Yes, Miss Emily. What kind? For rats and such? I’d recom —”

  “I want the best you have. I don’t care what kind.”

  The druggist named several. “They’ll kill anything up to an elephant. But what you want is —”
    
  “Arsenic,” Miss Emily said. “Is that a good one?”
    
  “Is . . . arsenic? Yes, ma’am. But what you want —”
    
  “I want arsenic.”`,
  `The druggist looked down at her. She looked back at him, <span class="vocab-word" data-word="erect">erect</span>, her face like a strained flag. “Why, of course,” the druggist said. “If that’s what you want. But the law requires you to tell what you are going to use it for.”
    
  Miss Emily just stared at him, her head <span class="vocab-word" data-word="tilted">tilted</span> back in order to look him eye for eye, until he looked away and went and got the arsenic and wrapped it up. The Negro delivery boy brought her the package; the druggist didn’t come back. When she opened the package at home there was written on the box, under the skull and bones:
  “For rats.”`,
  `IV
    
  SO the next day we all said, “She will kill herself”; and we said it would be the best thing. When she had first begun to be seen with Homer Barron, we had said, “She will marry him.” Then we said, “She will persuade him yet,” because Homer himself had remarked — he liked men, and it was known that he drank with the younger men in the Elks’ Club — that he was not a marrying man. Later we said, “Poor Emily” behind the jalousies as they passed on Sunday afternoon in the glittering buggy, Miss Emily with her head high and Homer Barron with his hat cocked and a cigar in his teeth, reins and whip in a yellow glove.

  Then some of the ladies began to say that it was a disgrace to the town and a bad example to the young people. The men did not want to interfere, but at last the ladies forced the Baptist minister — Miss Emily’s people were Episcopal — to call upon her. He would never <span class="vocab-word" data-word="divulge">divulge</span> what happened during that interview, but he refused to go back again. The next Sunday they again drove about the streets, and the following day the minister’s wife wrote to Miss Emily’s relations in Alabama.
    
  So she had blood-kin under her roof again and we sat back to watch developments. At first nothing happened. Then we were sure that they were to be married. We learned that Miss Emily had been to the jeweler’s and ordered a man’s toilet set in silver, with the letters H. B. on each piece. Two days later we learned that she had bought a complete outfit of men’s clothing, including a nightshirt, and we said, “They are married.” We were really glad. We were glad because the two female cousins were even more Grierson than Miss Emily had ever been.
  
  So we were not surprised when Homer Barron — the streets had been finished some time since — was gone. We were a little disappointed that there was not a public blowing-off, but we believed that he had gone on to prepare for Miss Emily’s coming, or to give her a chance to get rid of the cousins. (By that time it was a <span class="vocab-word" data-word="cabal">cabal</span>, and we were all Miss Emily’s allies to help circumvent the cousins.) Sure enough, after another week they departed.`,
 
  `And, as we had expected all along, within three days Homer Barron was back in town. A neighbor saw the Negro man admit him at the kitchen door at dusk one evening.

  And that was the last we saw of Homer Barron. And of Miss Emily for some time. The Negro man went in and out with the market basket, but the front door remained closed.
  Now and then we would see her at a window for a moment, as the men did that night when they sprinkled the lime, but for almost six months she did not appear on the streets. 
  Then we knew that this was to be expected too; as if that quality of her father which had <span class="vocab-word" data-word="thwarted">thwarted</span> her woman’s life so many times had been too <span class="vocab-word" data-word="virulent">virulent</span> and too furious to die.

  When we next saw Miss Emily, she had grown fat and her hair was turning gray. During the next few years it grew grayer and grayer until it attained an even pepper-and-salt iron-gray, when it ceased turning. Up to the day of her death at seventy-four it was still that vigorous iron-gray, like the hair of an active man.
  
  From that time on her front door remained closed, save for a period of six or seven years, when she was about forty, during which she gave lessons in china-painting. 
  She fitted up a studio in one of the downstairs rooms, where the daughters and granddaughters of Colonel Sartoris’ contemporaries were sent to her with the same regularity and in the same spirit that they were sent to church on Sundays with a twenty-five-cent piece for the collection plate. Meanwhile her taxes had been remitted.

  Then the newer generation became the backbone and the spirit of the town, and the painting pupils grew up and fell away and did not send their children to her with boxes of color and <span class="vocab-word" data-word="tedious">tedious</span> brushes and pictures cut from the ladies’ magazines. The front door closed upon the last one and remained closed for good. When the town got free postal delivery, Miss Emily alone refused to let them fasten the metal numbers above her door and attach a mailbox to it. She would not listen to them.`,
  `Daily, monthly, yearly we watched the Negro grow grayer and more stooped, going in and out with the market basket. Each December we sent her a tax notice, which would be returned by the post office a week later, unclaimed. Now and then we would see her in one of the downstairs windows — she had evidently shut up the top  floor of the house — like the carven torso of an idol in a <span class="vocab-word" data-word="niche">niche</span>, looking or not looking at us, we could never tell which. Thus she passed from generation to generation — dear, inescapable, impervious, tranquil, and <span class="vocab-word" data-word="perverse">perverse</span>.

  And so she died. Fell ill in the house filled with dust and shadows, with only a <span class="vocab-word" data-word="doddering">doddering</span> Negro man to wait on her. We did not even know she was sick; we had long since given up trying to get any information from the Negro.

  He talked to no one, probably not even to her, for his voice had grown harsh and rusty, as if from disuse.

  She died in one of the downstairs rooms, in a heavy walnut bed with a curtain, her gray head propped on a pillow yellow and moldy with age and lack of sunlight.`,
  `V
    
  THE negro met the first of the ladies at the front door and let them in, with their hushed, <span class="vocab-word" data-word="sibilant">sibilant</span> voices and their quick, curious glances, and then he disappeared. He walked right through the house and out the back and was not seen again.

  The two female cousins came at once. They held the funeral on the second day, with the town coming to look at Miss Emily beneath a mass of bought flowers, with the crayon face of her father musing profoundly above the bier and the ladies sibilant and <span class="vocab-word" data-word="macabre">macabre</span>; and the very old men — some in their brushed Confederate uniforms — on the porch and the lawn, talking of Miss Emily as if she had been a contemporary of theirs, believing that they had danced with her and courted her perhaps, confusing time with its mathematical progression, as the old do, to whom all the past is not a diminishing road but, instead, a huge meadow which no winter ever quite touches, divided from them now by the narrow bottle-neck of the most recent decade of years.
  
  Already we knew that there was one room in that region above stairs which no one had seen in forty years, and which would have to be forced. They waited until Miss Emily was decently in the ground before they opened it.

  The violence of breaking down the door seemed to fill this room with <span class="vocab-word" data-word="pervading">pervading</span> dust. A thin, acrid <span class="vocab-word" data-word="pall">pall</span> as of the tomb seemed to lie everywhere upon this room decked and furnished as for a bridal: upon the valance curtains of faded rose color, upon the rose-shaded lights, upon the dressing table, upon the delicate array of crystal and the man’s toilet things backed with tarnished silver, silver so tarnished that the monogram was obscured. Among them lay a collar and tie, as if they had just been removed, which, lifted, left upon the surface a pale crescent in the dust. Upon a chair hung the suit, carefully folded; beneath it the two mute shoes and the discarded socks.`,
  `The man himself lay in the bed.

  For a long while we just stood there, looking down at the profound and fleshless grin. The body had apparently once lain in the attitude of an embrace, but now the long sleep that outlasts love, that conquers even the <span class="vocab-word" data-word="grimace">grimace</span> of love, had <span class="vocab-word" data-word="cuckolded">cuckolded</span> him. What was left of him, rotted beneath what was left of the nightshirt, had become <span class="vocab-word" data-word="inextricable">inextricable</span> from the bed in which he lay; and upon him and upon the pillow beside him lay that even coating of the patient and biding dust.

  Then we noticed that in the second pillow was the <span class="vocab-word" data-word="indentation">indentation</span> of a head. One of us lifted something from it, and leaning forward, that faint and invisible dust dry and <span class="vocab-word" data-word="acrid">acrid</span> in the nostrils, we saw a long strand of iron-gray hair.
  
  ~ The End.` ],

       'stars': [
       `For four years, Alfredo Salazar had been <span class="vocab-word" data-word="betrothed">betrothed</span> to Esperanza. Everyone in their quiet, traditional society took their upcoming marriage for granted; it was an accepted fact, a structured path of duty, stability, and social expectation. Alfredo, a lawyer, lived a life governed by <span class="vocab-word" data-word="decorum">decorum</span>, but inside him, a quiet restlessness brewed.

       Then he met Julia Salas. During a brief summer visit, Julia’s warmth and unpretentious charm awakened something intense within Alfredo. For a <span class="vocab-word" data-word="fleeting">fleeting</span> month, he was swept away by a powerful infatuation. He felt completely torn between his deep sense of social responsibility to Esperanza and his passionate, unyielding desire for Julia. Ultimately, the crushing weight of societal pressure and the expectations of his family <span class="vocab-word" data-word="prevailed">prevailed</span>. Alfredo chose the path of duty. He stayed, and he married Esperanza.
       
       Eight years passed. Alfredo lived a stable, comfortable, and respectable life with Esperanza, yet his mind frequently wandered back to that summer. He carried a <span class="vocab-word" data-word="lingering">lingering</span>, regretful <span class="vocab-word" data-word="contemplation">contemplation</span>, nurturing the memory of Julia as the great, lost "magic" of his youth. He <span class="vocab-word" data-word="pined">pined</span> for her, wondering if the <span class="vocab-word" data-word="profound">profound</span> love he felt had been the truest thing in his life.`,

       `Eventually, a legal errand brought Alfredo to Julia’s remote hometown. He <span class="vocab-word" data-word="sought">sought</span> her out, driven by the intense need to see if the spark he had carried for nearly a decade was real.
       
       When he finally saw her, he was stunned. Julia was pleasant and kind, but as they spoke, Alfredo felt absolutely nothing. The magic was gone. With a bittersweet, mature clarity, he realized the painful <span class="vocab-word" data-word="situational irony">situational irony</span> of his life: he had spent years longing for a woman who did not actually exist in the way he had imagined. His intense feelings had not survived the test of reality.

       Looking up at the night sky, he understood the truth. His long-held love was like the light of dead stars—a brilliant, beautiful image casting its glow upon the earth, coming from something that had already vanished long ago.
       
       ~ The End.` ],

  'hour': [
  `Knowing that Mrs. Mallard was <span class="vocab-word" data-word="afflicted">afflicted</span> with a heart trouble, great care was taken to break to her as gently as possible the news of her husband's death.
     
  It was her sister Josephine who told her, in broken sentences; <span class="vocab-word" data-word="veiled">veiled</span> hints that revealed in half <span class="vocab-word" data-word="concealing">concealing</span>. Her husband's friend Richards was there, too, near her. It was he who had been in the newspaper office when intelligence of the railroad disaster was received, with Brently Mallard's name leading the list of "killed." He had only taken the time to assure himself of its truth by a second telegram, and had hastened to <span class="vocab-word" data-word="forestall">forestall</span> any less careful, less tender friend in bearing the sad message.
     
  She did not hear the story as many women have heard the same, with a paralyzed inability to accept its significance. She wept at once, with sudden, wild abandonment, in her sister's arms. When the storm of grief had spent itself she went away to her room alone. She would have no one follow her.
  
  There stood, facing the open window, a comfortable, roomy armchair. Into this she sank, pressed down by a physical exhaustion that haunted her body and seemed to reach into her soul.

  She could see in the open square before her house the tops of trees that were all <span class="vocab-word" data-word="aquiver">aquiver</span> with the new spring life. The delicious breath of rain was in the air. In the street below a peddler was crying his <span class="vocab-word" data-word="wares">wares</span>. The notes of a distant song which some one was singing reached her faintly, and countless sparrows were <span class="vocab-word" data-word="twittering">twittering</span> in the <span class="vocab-word" data-word="eaves">eaves</span>.`,
  `There were patches of blue sky showing here and there through the clouds that had met and piled one above the other in the west facing her window.

  She sat with her head thrown back upon the cushion of the chair, quite motionless, except when a sob came up into her throat and shook her, as a child who has cried itself to sleep continues to sob in its dreams.

  She was young, with a fair, calm face, whose lines <span class="vocab-word" data-word="bespoke">bespoke</span> <span class="vocab-word" data-word="repression">repression</span> and even a certain strength. But now there was a dull stare in her eyes, whose gaze was fixed away off <span class="vocab-word" data-word="yonder">yonder</span> on one of those patches of blue sky. It was not a glance of reflection, but rather indicated a suspension of intelligent thought.

  There was something coming to her and she was waiting for it, fearfully. What was it? She did not know; it was too <span class="vocab-word" data-word="subtle">subtle</span> and <span class="vocab-word" data-word="elusive">elusive</span> to name. But she felt it, creeping out of the sky, reaching toward her through the sounds, the scents, the color that filled the air.

  Now her bosom rose and fell <span class="vocab-word" data-word="tumultuously">tumultuously</span>. She was beginning to recognize this thing that was approaching to possess her, and she was striving to beat it back with her will--as powerless as her two white slender hands would have been. When she abandoned herself a little whispered word escaped her slightly parted lips. She said it over and over under hte breath: "free, free, free!" The vacant stare and the look of terror that had followed it went from her eyes. They stayed keen and bright. Her pulses beat fast, and the coursing blood warmed and relaxed every inch of her body`,
  `She did not stop to ask if it were or were not a <span class="vocab-word" data-word="monstrous">monstrous</span> joy that held her. A clear and exalted perception enabled her to dismiss the suggestion as trivial. She knew that she would weep again when she saw the kind, tender hands folded in death; the face that had never looked save with love upon her, fixed and gray and dead. But she saw beyond that bitter moment a long <span class="vocab-word" data-word="procession">procession</span> of years to come that would belong to her absolutely. And she opened and spread her arms out to them in welcome.

  There would be no one to live for during those coming years; she would live for herself. There would be no powerful will bending hers in that blind <span class="vocab-word" data-word="persistence">persistence</span> with which men and women believe they have a right to impose a private will upon a fellow-creature. A kind intention or a cruel intention made the act seem no less a crime as she looked upon it in that brief moment of <span class="vocab-word" data-word="illumination">illumination</span>.

  And yet she had loved him--sometimes. Often she had not. What did it matter! What could love, the unsolved mystery, count for in the face of this possession of <span class="vocab-word" data-word="self-assertion">self-assertion</span> which she suddenly recognized as the strongest impulse of her being!
  
  "Free! Body and soul free!" she kept whispering.

  Josephine was kneeling before the closed door with her lips to the keyhold, imploring for admission. "Louise, open the door! I beg; open the door--you will make yourself ill. What are you doing, Louise? For heaven's sake open the door."`,
  `"Go away. I am not making myself ill." No; she was drinking in a very <span class="vocab-word" data-word="elixir">elixir</span> of life through that open window.

  Her fancy was running riot along those days ahead of her. Spring days, and summer days, and all sorts of days that would be her own. She breathed a quick prayer that life might be long. It was only yesterday she had thought with a <span class="vocab-word" data-word="shudder">shudder</span> that life might be long.

  She arose at length and opened the door to her sister's <span class="vocab-word" data-word="importunities">importunities</span>. There was a <span class="vocab-word" data-word="feverish">feverish</span> triumph in her eyes, and she carried herself <span class="vocab-word" data-word="unwittingly">unwittingly</span> like a goddess of Victory. She clasped her sister's waist, and together they descended the stairs. Richards stood waiting for them at the bottom.

  Some one was opening the front door with a <span class="vocab-word" data-word="latchkey">latchkey</span>. It was Brently Mallard who entered, a little travel-stained, composedly carrying his grip-sack and umbrella. He had been far from the scene of the accident, and did not even know there had been one. He stood amazed at Josephine's <span class="vocab-word" data-word="piercing">piercing</span> cry; at Richards' quick motion to screen him from the view of his wife.

  When the doctors came they said she had died of heart disease--of the joy that kills.

  ~ The End.` ],

       'magi': [
       `One dollar and eighty-seven cents. That was all Della had, and sixty cents of it was in pennies. She had been saving every penny she could for months to buy a Christmas gift for her husband, Jim. Tomorrow would be Christmas, and she had almost no money. With a sigh, she flopped on the couch, feeling both <span class="vocab-word" data-word="frustrated">frustrated</span> and sad.
     
       Della and Jim lived in a <span class="vocab-word" data-word="modest">modest</span> flat that cost $8 a week. Despite their limited <span class="vocab-word" data-word="means">means</span>, they were happy together. When Jim came home, he was always called “Jim” by Della, and she hugged him with all her love.
    
       Della <span class="vocab-word" data-word="longed">longed</span> to buy a gift worthy of Jim, something fine and meaningful. She had planned and dreamed for hours, but with only $1.87, she didn’t know how she could afford anything special.
       
       Finally, in a moment of determination, she decided to sell her most prized <span class="vocab-word" data-word="possession">possession</span>—her long, beautiful hair. She went to a wig maker and sold it for twenty dollars. With the money, she bought a fine <span class="vocab-word" data-word="platinum">platinum</span> chain for Jim’s gold watch, a gift she thought worthy of him.`,
       `When Christmas arrived, Della <span class="vocab-word" data-word="anxiously">anxiously</span> awaited Jim’s reaction. That evening, he entered the flat, and Della proudly showed him the chain. Jim looked at her <span class="vocab-word" data-word="strangely">strangely</span>, noticing her short hair.

       “My hair’s sold—it’s gone, sold, and bought for your gold watch!” Della <span class="vocab-word" data-word="exclaimed">exclaimed</span>.

       Jim smiled with deep affection, hugged her, and revealed his own surprise: he had sold his gold watch to buy a set of combs for Della’s beautiful hair. Both had sacrificed their most treasured possessions to buy gifts for the other, unaware of the <span class="vocab-word" data-word="irony">irony</span> in their situation.
       
       Although the gifts could not be used as <span class="vocab-word" data-word="intended">intended</span>, the story shows the <span class="vocab-word" data-word="depth">depth</span> of Della and Jim’s love and <span class="vocab-word" data-word="selflessness">selflessness</span>. The couple’s actions remind us that love and sacrifice are more <span class="vocab-word" data-word="valuable">valuable</span> than material possessions. Like the wise men who gave gifts to the Baby Jesus, Della and Jim were wise in giving from the heart, demonstrating that true wealth lies in love and <span class="vocab-word" data-word="generosity">generosity</span>.
       
       ~ The End.` ], };

/* ============================================================
  PART 2. VOCABULARY SECTION
============================================================ */
const dictionary = {
/* ---------- A ROSE FOR EMILY ---------- */
squarish: { pronunciation: "/ˈskweərɪʃ/", pos: "Adjective", meaning: "Having an almost square shape.", tagalog: "Halos parisukat" },
cupolas: { pronunciation: "/ˈkjuːpələz/", pos: "Noun", meaning: "Dome-shaped structures crowning a building.", tagalog: "Mga simboryo" },
spires: { pronunciation: "/ˈspaɪərz/", pos: "Noun", meaning: "Tall, pointed towers rising above a building.", tagalog: "Mga tore" },
encroached: { pronunciation: "/ɪnˈkroʊtʃt/", pos: "Verb", meaning: "Gradually advanced beyond proper limits.", tagalog: "Sinakop/Nilusob" },
obliterated: { pronunciation: "/əˈblɪtəreɪtɪd/", pos: "Verb", meaning: "Completely destroyed or erased.", tagalog: "Binura" },
august: { pronunciation: "/ɔːˈɡʌst/", pos: "Adjective", meaning: "Worthy of great respect and dignity.", tagalog: "Kagalang-galang" },
edict: { pronunciation: "/ˈiːdɪkt/", pos: "Noun", meaning: "An official order issued by an authority.", tagalog: "Kautusan" },
perpetuity: { pronunciation: "/ˌpɜːrpəˈtuːəti/", pos: "Noun", meaning: "An endless or indefinite period of time.", tagalog: "Kawalang-hanggan" },
aldermen: { pronunciation: "/ˈɔːldərmən/", pos: "Noun", meaning: "Officials serving on a town council.", tagalog: "Mga konsehal" },
archaic: { pronunciation: "/ɑːrˈkeɪɪk/", pos: "Adjective", meaning: "Belonging to an earlier period; old-fashioned.", tagalog: "Sinauna" },
dank: { pronunciation: "/dæŋk/", pos: "Adjective", meaning: "Unpleasantly damp and cold.", tagalog: "Mamasa-masa" },
sluggishly: { pronunciation: "/ˈslʌɡɪʃli/", pos: "Adverb", meaning: "Moving in a slow and heavy manner.", tagalog: "Mabagal" },
motes: { pronunciation: "/moʊts/", pos: "Noun", meaning: "Tiny specks floating in the air.", tagalog: "Maliit na butil" },
easel: { pronunciation: "/ˈiːzəl/", pos: "Noun", meaning: "A stand used to support a canvas or display.", tagalog: "Patungan ng pinta" },
ebony: { pronunciation: "/ˈɛbəni/", pos: "Noun", meaning: "Deep black in color.", tagalog: "Isang madilim na kahoy" },
ridge: { pronunciation: "/rɪdʒ/", pos: "Noun", meaning: "A long, narrow raised strip or crest.", tagalog: "Isang malalaking elevation" },
vanquished: { pronunciation: "/ˈvæŋkwɪʃt/", pos: "Verb", meaning: "Defeated or overcome completely.", tagalog: "Natalo/Nagapi" },
temerity: { pronunciation: "/təˈmɛrəti/", pos: "Noun", meaning: "Reckless boldness or excessive confidence.", tagalog: "Katapangan/Kapal ng mukha" },
teeming: { pronunciation: "/ˈtiːmɪŋ/", pos: "Adjective", meaning: "Filled abundantly or overflowing.", tagalog: "Nag-uumapaw" },
deprecation: { pronunciation: "/ˌdɛprɪˈkeɪʃən/", pos: "Noun", meaning: "The expression of disapproval or belittlement.", tagalog: "Pagbatikos" },
burglars: { pronunciation: "/ˈbɜːrɡlərz/", pos: "Noun", meaning: "People who unlawfully enter buildings to steal.", tagalog: "Mga magnanakaw" },
spraddled: { pronunciation: "/ˈsprædəld/", pos: "Verb", meaning: "Spread out awkwardly with limbs extended.", tagalog: "Nakabukaka" },
vindicated: { pronunciation: "/ˈvɪndɪkeɪtɪd/", pos: "Verb", meaning: "Cleared from blame or justified.", tagalog: "Napatunayan na tama" },
pauper: { pronunciation: "/ˈpɔːpər/", pos: "Noun", meaning: "A person living in extreme poverty.", tagalog: "Pulubi" },
vague: { pronunciation: "/veɪɡ/", pos: "Adjective", meaning: "Unclear or indefinite.", tagalog: "Malabo" },
serene: { pronunciation: "/səˈriːn/", pos: "Adjective", meaning: "Calm and undisturbed.", tagalog: "Payapa" },
buggy: { pronunciation: "/ˈbʌɡi/", pos: "Noun/Adjective", meaning: "A light horse-drawn carriage.", tagalog: "Karwaheng may gulong" },
"noblesse oblige": { pronunciation: "/noʊˌblɛs oʊˈbliːʒ/", pos: "Noun", meaning: "The duty of privileged people to act honorably.", tagalog: "Pananagutang kaakibat ng mataas na katayuan" },
rustling: { pronunciation: "/ˈrʌslɪŋ/", pos: "Noun/Verb", meaning: "A soft sound made by the movement of leaves or fabric.", tagalog: "Kaluskos" },
imperviousness: { pronunciation: "/ɪmˈpɜːrviəsnəs/", pos: "Noun", meaning: "The quality of being unaffected or resistant.", tagalog: "Hindi tinatablan" },
erect: { pronunciation: "/ɪˈrɛkt/", pos: "Verb/Adjective", meaning: "Standing upright or constructed vertically.", tagalog: "Itinayo/Tuwid" },
tilted: { pronunciation: "/ˈtɪltɪd/", pos: "Verb/Adjective", meaning: "Leaning or slanting to one side.", tagalog: "Tagilid" },
divulge: { pronunciation: "/daɪˈvʌldʒ/", pos: "Verb", meaning: "To reveal something secret.", tagalog: "Ibunyag" },
cabal: { pronunciation: "/kəˈbɑːl/", pos: "Noun", meaning: "A secret group working toward a shared goal.", tagalog: "Lihim na pangkat" },
thwarted: { pronunciation: "/ˈθwɔːrtɪd/", pos: "Verb", meaning: "Prevented from succeeding.", tagalog: "Hadlang" },
virulent: { pronunciation: "/ˈvɪrələnt/", pos: "Adjective", meaning: "Highly harmful or bitterly hostile.", tagalog: "Mabagsik/Mapanganib" },
tedious: { pronunciation: "/ˈtiːdiəs/", pos: "Adjective", meaning: "Long, tiresome, and monotonous.", tagalog: "Nakababagot" },
niche: { pronunciation: "/niːʃ/", pos: "Noun", meaning: "A particular place or position suited to someone or something.", tagalog: "Natatanging puwang/Larangan" },
perverse: { pronunciation: "/pərˈvɜːrs/", pos: "Adjective", meaning: "Deliberately contrary or stubbornly unreasonable.", tagalog: "Salungat/Baluktot" },
doddering: { pronunciation: "/ˈdɑːdərɪŋ/", pos: "Adjective", meaning: "Weak and shaky because of old age.", tagalog: "Ulyanin" },
sibilant: { pronunciation: "/ˈsɪbɪlənt/", pos: "Adjective", meaning: "Characterized by a hissing sound.", tagalog: "Sumisipol na tunog" },
macabre: { pronunciation: "/məˈkɑːb/", pos: "Adjective", meaning: "Disturbingly associated with death.", tagalog: "Mapanganib/Nakakatakot" },
pervading: { pronunciation: "/pərˈveɪdɪŋ/", pos: "Verb/Adjective", meaning: "Spreading throughout every part.", tagalog: "Laganap" },
acrid: { pronunciation: "/ˈækrɪd/", pos: "Adjective", meaning: "Having a sharp and irritating smell.", tagalog: "Matapang na amoy" },
pall: { pronunciation: "/pɔːl/", pos: "Noun", meaning: "A gloomy atmosphere hanging over something.", tagalog: "Bigat ng damdamin" },
grimace: { pronunciation: "/ˈɡrɪməs/", pos: "Noun/Verb", meaning: "A twisted facial expression showing discomfort or disgust.", tagalog: "Pag-ngiwi" },
cuckolded: { pronunciation: "/ˈkʌkəldɪd/", pos: "Verb", meaning: "Deceived by a spouse's unfaithfulness.", tagalog: "Pinag-taksilan ng asawa" },
inextricable: { pronunciation: "/ˌɪnɪkˈstrɪkəbəl/", pos: "Adjective", meaning: "Impossible to separate or untangle.", tagalog: "Hindi maihiwalay" },
indentation: { pronunciation: "/ˌɪndɛnˈteɪʃən/", pos: "Noun", meaning: "A dent, hollow, or recessed mark.", tagalog: "Uka o Bakas ng pagkakalubog" },
    
/* ---------- THE DEAD STARS ---------- */
betrothed: { pronunciation: "/bɪˈtroʊðd/", pos: "Adjective/Verb", meaning: "Engaged to be married.", tagalog: "Kasintahan" },
decorum: { pronunciation: "/dɪˈkɔːrəm/", pos: "Noun", meaning: "Behavior that is proper and socially acceptable.", tagalog: "Kagandahang-asal" },
fleeting: { pronunciation: "/ˈfliːtɪŋ/", pos: "Adjective", meaning: "Lasting only for a very short time.", tagalog: "Panandalian" },
prevailed: { pronunciation: "/prɪˈveɪld/", pos: "Verb", meaning: "Proved stronger or more influential in the end.", tagalog: "Nagtagumpay" },
lingering: { pronunciation: "/ˈlɪŋɡərɪŋ/", pos: "Adjective/Verb", meaning: "Continuing to exist or remain for a long time.", tagalog: "Nanatili" },
contemplation: { pronunciation: "/ˌkɑːntəmˈpleɪʃən/", pos: "Noun", meaning: "Deep and careful thought.", tagalog: "Pagsusuri" },
pined: { pronunciation: "/paɪnd/", pos: "Verb", meaning: "Longed deeply for someone or something.", tagalog: "Nangulila" },
profound: { pronunciation: "/prəˈfaʊnd/", pos: "Adjective", meaning: "Very deep or intense.", tagalog: "Malalim" },
sought: { pronunciation: "/sɔːt/", pos: "Verb", meaning: "Tried to find or obtain.", tagalog: "Hinahanap" },
"situational irony": { pronunciation: "/ˌsɪtʃuˈeɪʃənəl ˈaɪrəni/", pos: "Noun", meaning: "A situation in which the actual outcome is the opposite of what was expected.", tagalog: "Situasyon na hindi inaasahan" },

/* ---------- THE STORY OF AN HOUR ---------- */
afflicted: { pronunciation: "/əˈflɪktɪd/", pos: "Adjective/Verb", meaning: "Suffering from pain, grief, or a serious condition.", tagalog: "Nagdurusa" },
veiled: { pronunciation: "/veɪld/", pos: "Adjective/Verb", meaning: "Hidden or partly concealed.", tagalog: "Nakatago" },
concealing: { pronunciation: "/kənˈsiːlɪŋ/", pos: "Verb", meaning: "Keeping something from being seen or known.", tagalog: "Ikinukubli" },
forestall: { pronunciation: "/fɔːrˈstɔːl/", pos: "Verb", meaning: "To prevent something from happening beforehand.", tagalog: "Hadlangan" },
aquiver: { pronunciation: "/əˈkwɪvər/", pos: "Adjective", meaning: "Trembling with strong emotion.", tagalog: "Nanginginig" },
wares: { pronunciation: "/wɛərz/", pos: "Noun", meaning: "Goods offered for sale.", tagalog: "Paninda" },
twittering: { pronunciation: "/ˈtwɪtərɪŋ/", pos: "Verb/Noun", meaning: "Soft chirping sounds made by birds.", tagalog: "Huni" },
eaves: { pronunciation: "/iːvz/", pos: "Noun", meaning: "The lower edges of a roof that project beyond the walls.", tagalog: "Bubungan" },
bespoke: { pronunciation: "/bɪˈspoʊk/", pos: "Adjective/Verb", meaning: "Showed or indicated something.", tagalog: "Nagpahiwatig" },
repression: { pronunciation: "/rɪˈprɛʃən/", pos: "Noun", meaning: "The act of suppressing feelings or desires.", tagalog: "Pagsupil" },
yonder: { pronunciation: "/ˈjɑːndər/", pos: "Adjective/Adverb", meaning: "Located at some distance away.", tagalog: "Doon" },
subtle: { pronunciation: "/ˈsʌtəl/", pos: "Adjective", meaning: "Delicate or difficult to notice.", tagalog: "Banayad" },
elusive: { pronunciation: "/ɪˈluːsɪv/", pos: "Adjective", meaning: "Difficult to grasp or understand fully.", tagalog: "Mailap" },
tumultuously: { pronunciation: "/tuˈmʌltʃuəsli/", pos: "Adverb", meaning: "In a confused and emotionally turbulent manner.", tagalog: "Magulo" },
monstrous: { pronunciation: "/ˈmɑːnstrəs/", pos: "Adjective", meaning: "Shockingly cruel or unacceptable.", tagalog: "Kakila-kilabot" },
procession: { pronunciation: "/prəˈsɛʃən/", pos: "Noun", meaning: "A continuous series moving forward.", tagalog: "Pagkakasunod" },
persistence: { pronunciation: "/pərˈsɪstəns/", pos: "Noun", meaning: "The quality of continuing despite difficulty.", tagalog: "Pagtitiyaga" },
illumination: { pronunciation: "/ɪˌluːməˈneɪʃən/", pos: "Noun", meaning: "A sudden understanding or realization.", tagalog: "Kaliwanagan" },
"self-assertion": { pronunciation: "/ˌsɛlf əˈsɜːrʃən/", pos: "Noun", meaning: "The expression of one's own independence and identity.", tagalog: "Paggigiit" },
elixir: { pronunciation: "/ɪˈlɪksər/", pos: "Noun", meaning: "Something that brings renewed energy or happiness.", tagalog: "Panlunas" },
shudder: { pronunciation: "/ˈʃʌdər/", pos: "Verb/Noun", meaning: "A trembling movement caused by strong emotion.", tagalog: "Panginginig" },
importunities: { pronunciation: "/ˌɪmpɔːrˈtuːnətiz/", pos: "Noun", meaning: "Repeated and urgent requests.", tagalog: "Pangungulit" },
feverish: { pronunciation: "/ˈfiːvərɪʃ/", pos: "Adjective", meaning: "Marked by intense excitement or nervousness.", tagalog: "Balisa" },
unwittingly: { pronunciation: "/ʌnˈwɪtɪŋli/", pos: "Adverb", meaning: "Without being aware of it.", tagalog: "Hindi-sinasadya" },
latchkey: { pronunciation: "/ˈlætʃkiː/", pos: "Noun", meaning: "A key used to unlock a door.", tagalog: "Susi" },
piercing: { pronunciation: "/ˈpɪrsɪŋ/", pos: "Adjective/Verb", meaning: "Sharp, intense, or deeply affecting.", tagalog: "Matalim" },

/* ---------- THE GIFT OF THE MAGI ---------- */
frustrated: { pronunciation: "/ˈfrʌstreɪtɪd/", pos: "Adjective/Verb", meaning: "Feeling disappointed because of one's inability to achieve something.", tagalog: "Nabigo" },
modest: { pronunciation: "/ˈmɑːdəst/", pos: "Adjective", meaning: "Simple and humble in appearance or lifestyle.", tagalog: "Payak" },
means: { pronunciation: "/miːnz/", pos: "Noun", meaning: "Financial resources or ability to obtain something.", tagalog: "Kakayahan" },
longed: { pronunciation: "/lɔːŋd/", pos: "Verb", meaning: "Desired something deeply.", tagalog: "Nanabik" },
possession: { pronunciation: "/pəˈzɛʃən/", pos: "Noun", meaning: "Something that belongs to someone.", tagalog: "Pag-aari" },
platinum: { pronunciation: "/ˈplætənəm/", pos: "Noun", meaning: "A valuable silver-white metal used in jewelry.", tagalog: "Platino" },
anxiously: { pronunciation: "/ˈæŋkʃəsli/", pos: "Adverb", meaning: "In a worried or nervous manner.", tagalog: "Balisa" },
strangely: { pronunciation: "/ˈstreɪndʒli/", pos: "Adverb", meaning: "In an unusual or unexpected way.", tagalog: "Kataka-taka" },
exclaimed: { pronunciation: "/ɪkˈskleɪmd/", pos: "Verb", meaning: "Spoke suddenly and with strong emotion.", tagalog: "Bumulalas" },
irony: { pronunciation: "/ˈaɪrəni/", pos: "Noun", meaning: "A situation in which the result is opposite to what was expected.", tagalog: "Kabalintunaan" },
intended: { pronunciation: "/ɪnˈtɛndɪd/", pos: "Verb/Adjective", meaning: "Planned or meant for a particular purpose.", tagalog: "Nilayon" },
depth: { pronunciation: "/dɛpθ/", pos: "Noun", meaning: "The intensity or seriousness of something.", tagalog: "Lalim" },
selflessness: { pronunciation: "/ˈsɛlfləsnəs/", pos: "Noun", meaning: "The quality of putting others before oneself.", tagalog: "Pagiging-mapagbigay" },
valuable: { pronunciation: "/ˈvæljuəbəl/", pos: "Adjective", meaning: "Having great worth or importance.", tagalog: "Mahalaga" },
generosity: { pronunciation: "/ˌdʒɛnəˈrɑːsəti/", pos: "Noun", meaning: "The willingness to give freely and help others.", tagalog: "Pagkabukas-palad" },
};

const popup = document.getElementById("dictionaryPopup"); const popupWord = document.getElementById("popupWord");
const popupPronunciation = document.getElementById("popupPronunciation"); const popupPOS = document.getElementById("popupPOS");
const popupMeaning = document.getElementById("popupMeaning"); const popupTagalog = document.getElementById("popupTagalog");
let currentVocabularyWord = ""; document.addEventListener("click", function(e){ const word = e.target.closest(".vocab-word");
if(!word){ if(!popup.contains(e.target)){ popup.classList.remove("show");
document.getElementById("popupOverlay").classList.remove("show"); }
return; } const data = dictionary[word.dataset.word]; if(!data) return;
popupWord.textContent = word.dataset.word.toUpperCase(); currentVocabularyWord = word.dataset.word;
popupPronunciation.textContent = data.pronunciation;
popupPOS.textContent = data.pos; popupMeaning.textContent = data.meaning;
popupTagalog.textContent = data.tagalog; popup.classList.add("show");
document.getElementById("popupOverlay").classList.add("show"); } );
const popupSpeakBtn = document.getElementById("popupSpeakBtn");
popupSpeakBtn.addEventListener("click", () => {
if(!currentVocabularyWord) return; speak(currentVocabularyWord); });

/* ---------- BOOKMARK ---------- */
document.querySelectorAll('[id="readerBookmarkBtn"]').forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentBook) {
            localStorage.setItem(
                "bookmark_" + currentBook,
                currentPage
            );

            const confirmation = document.getElementById("bookmarkConfirmation");

            if (confirmation) {
                confirmation.classList.add("show");

                setTimeout(() => {
                    confirmation.classList.remove("show");
                }, 3000);
            }
        }
    });
});

/* =========================================
   BACKGROUND MUSIC SYSTEM
   ========================================= */

const backgroundSoundBtn =
    document.getElementById("backgroundSoundBtn");

const backgroundMusicPanel =
    document.getElementById("backgroundMusicPanel");

const backgroundMusic =
    document.getElementById("backgroundMusic");

const musicChoices =
    document.querySelectorAll(".music-choice");

const stopBackgroundMusic =
    document.getElementById("stopBackgroundMusic");


/* =========================================
   OPEN / CLOSE MUSIC PANEL
   ========================================= */

backgroundSoundBtn.addEventListener("click", function (event) {

    event.stopPropagation();

    backgroundMusicPanel.classList.toggle("show");

});


/* =========================================
   MUSIC CHOICES
   ========================================= */

musicChoices.forEach(function (choice) {

    choice.addEventListener("click", function (event) {

        event.stopPropagation();

        const selectedMusic = this.dataset.music;


        /* ---------------------------------
           SAME MUSIC CLICKED
           --------------------------------- */

        if (
            backgroundMusic.dataset.currentMusic === selectedMusic
        ) {

            if (backgroundMusic.paused) {

                /* PAUSED → PLAY */

                backgroundMusic.play();

                this.classList.add("active");

            } else {

                /* PLAYING → PAUSE */

                backgroundMusic.pause();

                this.classList.remove("active");

            }

            return;
        }


        /* ---------------------------------
           DIFFERENT MUSIC CLICKED
           --------------------------------- */

        /* Stop current music */
        backgroundMusic.pause();

        backgroundMusic.currentTime = 0;


        /* Remove active state */
        musicChoices.forEach(function (item) {
            item.classList.remove("active");
        });


        /* Set new music */
        backgroundMusic.src =
            "audio/" + selectedMusic;

        backgroundMusic.dataset.currentMusic =
            selectedMusic;


        /* Background music volume */

        backgroundMusic.volume = 0.35;


        /* Play new music */

        backgroundMusic.play()
            .then(function () {

                choice.classList.add("active");

            })
            .catch(function (error) {

                console.error(
                    "Background music could not play:",
                    error
                );

            });

    });

});


/* =========================================
   STOP MUSIC
   ========================================= */

stopBackgroundMusic.addEventListener("click", function (event) {

    event.stopPropagation();


    backgroundMusic.pause();

    backgroundMusic.currentTime = 0;

    backgroundMusic.removeAttribute("src");

    backgroundMusic.dataset.currentMusic = "";


    musicChoices.forEach(function (choice) {

        choice.classList.remove("active");

    });

});


/* =========================================
   CLOSE PANEL WHEN CLICKING OUTSIDE
   ========================================= */

document.addEventListener("click", function (event) {

    if (
        !backgroundMusicPanel.contains(event.target) &&
        !backgroundSoundBtn.contains(event.target)
    ) {

        backgroundMusicPanel.classList.remove("show");

    }

});

/* =========================================
   READER SEARCH BUTTON
   ========================================= */

const readerSearchBtn = document.getElementById("readerSearchBtn");
const readerSearchContainer = document.getElementById("readerSearchContainer");
const readerSearchInput = document.getElementById("readerSearchInput");


/* =========================================
   OPEN / CLOSE SEARCH BAR
   ========================================= */

readerSearchBtn.addEventListener("click", function (event) {

    event.stopPropagation();

    readerSearchContainer.classList.toggle("show");

    /* Automatically focus the search box */
    if (readerSearchContainer.classList.contains("show")) {

        readerSearchInput.focus();

    } else {

        readerSearchInput.value = "";

    }

});


/* =========================================
   PREVENT SEARCH BAR FROM CLOSING
   WHEN CLICKED INSIDE
   ========================================= */

readerSearchContainer.addEventListener("click", function (event) {

    event.stopPropagation();

});


/* =========================================
   CLOSE SEARCH BAR WHEN CLICKING OUTSIDE
   ========================================= */

document.addEventListener("click", function (event) {

    if (
        !readerSearchContainer.contains(event.target) &&
        !readerSearchBtn.contains(event.target)
    ) {

        readerSearchContainer.classList.remove("show");

    }

});

document.addEventListener("DOMContentLoaded", function () {

    const notesButton = document.getElementById("readerNotesBtn");
    const notesPanel = document.getElementById("notesPanel");
    const notesInput = document.getElementById("notesInput");
    const saveButton = document.getElementById("saveNotesBtn");

    // Check if HTML elements exist
    if (!notesButton || !notesPanel || !notesInput || !saveButton) {
        console.log("NOTES ERROR:", {
            notesButton,
            notesPanel,
            notesInput,
            saveButton
        });
        return;
    }


    // ================================
    // OPEN NOTES
    // ================================

    notesButton.addEventListener("click", function (event) {

        event.stopPropagation();

        notesPanel.classList.toggle("show");

        // Load saved notes
        const savedNotes = localStorage.getItem("irisReaderNotes");

        if (savedNotes !== null) {
            notesInput.value = savedNotes;
        }

    });


    // ================================
    // DON'T CLOSE WHEN CLICKING PANEL
    // ================================

    notesPanel.addEventListener("click", function (event) {
        event.stopPropagation();
    });


    // ================================
    // SAVE NOTES
    // ================================

    saveButton.addEventListener("click", function () {

        localStorage.setItem(
            "irisReaderNotes",
            notesInput.value
        );

        saveButton.textContent = "Saved ✓";

        setTimeout(function () {
            saveButton.textContent = "Save";
        }, 1000);

    });


    // ================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ================================

    document.addEventListener("click", function (event) {

        if (
            !notesPanel.contains(event.target) &&
            !notesButton.contains(event.target)
        ) {

            notesPanel.classList.remove("show");

        }

    });

});

/* ==========================================
   READER SEARCH — OPEN / CLOSE
========================================== */
document.querySelectorAll(".reader-search").forEach(search => { const toggle = search.querySelector(".reader-search-toggle");
const input = search.querySelector(".reader-search-input"); const close = search.querySelector(".reader-search-close");
if (!toggle || !input || !close) return;
/* OPEN */
   toggle.addEventListener("click", function(e) { e.stopPropagation(); search.classList.add("active"); setTimeout(() => {
   input.focus(); }, 300); });
/* CLOSE */
   close.addEventListener("click", function(e) { e.stopPropagation(); search.classList.remove("active"); input.value = ""; });
/* DON'T CLOSE WHEN CLICKING INSIDE */
   search.addEventListener("click", function(e) { e.stopPropagation(); }); });

/* ============================================================
  PART 6. VOICE SYSTEM
============================================================ */
/* ------------------------------------------------------------
   VARIABLES
------------------------------------------------------------ */
/* Nasa PART 1 na ang variables:
   voiceMale, voiceFemale
   selectedVoice, currentGender
   currentRate, voicesList, voicesLoaded
   currentUtterance, previewUtterance */

/* ------------------------------------------------------------
   LOAD VOICES
------------------------------------------------------------ */
function loadVoices() {
if (voicesLoaded) return; voicesList = speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
if (voicesList.length === 0) return;
voiceMale = voicesList.find(v => /male|david|mark|george|guy/i.test(v.name) ) || voicesList[0];
voiceFemale = voicesList.find(v => /female|hazel|susan|zira|aria/i.test(v.name) ) || voicesList[1] || voicesList[0];
voicesLoaded = true; console.log("LOCKED Male Voice:", voiceMale?.name); console.log("LOCKED Female Voice:", voiceFemale?.name);
currentGender = localStorage.getItem('preferredVoice') || 'female'; currentRate = parseFloat(localStorage.getItem('preferredRate')) || 1.0;
const speedSlider = document.getElementById('speedSlider'); const speedLabel = document.getElementById('speedLabel'); if (speedSlider) { speedSlider.value = currentRate;
if (speedLabel) speedLabel.textContent = getSpeedText(currentRate); } setVoice(currentGender); }
if (speechSynthesis.onvoiceschanged !== undefined) { speechSynthesis.onvoiceschanged = loadVoices; } loadVoices();

/* ------------------------------------------------------------
   VOICE SELECTION
------------------------------------------------------------ */
function setVoice(gender) {
if (!voicesLoaded) return; currentGender = gender; selectedVoice = (gender === 'male') ? voiceMale : voiceFemale;
if (selectedVoice) { console.log("Active Voice:", selectedVoice.name); localStorage.setItem( 'preferredVoice', gender ); } }
document.querySelectorAll('.voice-list button')
.forEach(btn => { btn.addEventListener('click', () => {
const gender = btn.getAttribute('data-gender'); setVoice(gender); speakSample(); }); });

/* ------------------------------------------------------------
   SPEED SLIDER
------------------------------------------------------------ */
function getSpeedText(rate) {
if (rate <= 0.7) return '0.5x - Slow'; if (rate <= 0.9) return '0.8x - Slow';
if (rate <= 1.1) return '1x - Normal'; if (rate <= 1.6) return '1.5x - Fast';
return '2x - Fastest'; }
if (speedSlider) { speedSlider.addEventListener('input', (e) => { currentRate = parseFloat(e.target.value);
if (speedLabel) speedLabel.textContent = getSpeedText(currentRate);
localStorage.setItem( 'preferredRate', currentRate ); speakSample(); }); }

/* ------------------------------------------------------------
   SPEAK
------------------------------------------------------------ */
function stopSpeaking() { speechSynthesis.cancel(); currentUtterance = null; previewUtterance = null; }
function speak(text) {
if (!text || text.trim() === "") return; if (speechSynthesis.speaking) {
speechSynthesis.cancel(); currentUtterance = null; return; } currentUtterance = new SpeechSynthesisUtterance(text);
if (selectedVoice) { currentUtterance.voice = selectedVoice; currentUtterance.lang = selectedVoice.lang; }
currentUtterance.rate = currentRate; currentUtterance.pitch = 1; currentUtterance.volume = 1;
currentUtterance.onend = () => { currentUtterance = null; };
speechSynthesis.speak(currentUtterance); }

/* ------------------------------------------------------------
   SPEAK SAMPLE
------------------------------------------------------------ */
function speakSample() {
if (!voicesLoaded || !selectedVoice) return;
if ( previewUtterance || speechSynthesis.speaking ) { speechSynthesis.cancel();
previewUtterance = null; currentUtterance = null; return; }
previewUtterance = new SpeechSynthesisUtterance( "This is the voice speed" );
previewUtterance.voice = selectedVoice; previewUtterance.lang = selectedVoice.lang; previewUtterance.rate = currentRate;
previewUtterance.pitch = 1; previewUtterance.volume = 1; previewUtterance.onstart = () => { previewUtterance.isSpeaking = true; };
previewUtterance.onend = () => { previewUtterance = null; };
previewUtterance.onerror = () => { previewUtterance = null; };
speechSynthesis.cancel(); setTimeout(() => {
speechSynthesis.speak(previewUtterance); }, 100);}

/* ------------------------------------------------------------
   AUTO STOP
------------------------------------------------------------ */
   function brutalStop() {
   speechSynthesis.cancel(); currentUtterance = null; previewUtterance = null; }
   document.querySelectorAll('.start-reading')
   .forEach(btn => { btn.addEventListener('click', () => { brutalStop(); }); });
   document.querySelectorAll('.reader-back')
   .forEach(btn => { btn.addEventListener('click', () => { brutalStop(); }); });
   document.querySelectorAll( '[id^="nextPageBtn"], [id^="prevPageBtn"]' ).forEach(btn => {
   btn.addEventListener('click', () => { brutalStop(); }, true); });

/* ============================================================
  PART 7. INITIALIZATION
============================================================ */
/* ------------------------------------------------------------
   DOMContentLoaded
------------------------------------------------------------ */
const savedScale = parseInt(localStorage.getItem("libraryScale"));
if (!isNaN(savedScale)) { currentSize = savedScale;
switch (currentSize) { case 80: currentFontSize = 14; break; case 90: currentFontSize = 16; break;
case 100: currentFontSize = 18; break; case 110: currentFontSize = 20; break; case 120: currentFontSize = 22; break; }
updateScale(); } document.addEventListener("DOMContentLoaded", () => { setupAllBookButtons(); setupFontButtons();
document.querySelectorAll('[id^="increaseFontBtn"]').forEach(btn => { btn.addEventListener("click", function () {
if (!currentBook) return; if (currentFontSize < 30) { currentFontSize += 2; }
const idSuffix = currentBook.charAt(0).toUpperCase() + currentBook.slice(1);
const text = document.getElementById("readerText" + idSuffix);
if (text) { text.style.fontSize = currentFontSize + "px"; } this.blur(); }); });
document.querySelectorAll('[id^="decreaseFontBtn"]').forEach(btn => { btn.addEventListener("click", function () {
if (!currentBook) return; if (currentFontSize > 14) { currentFontSize -= 2; }
const idSuffix = currentBook.charAt(0).toUpperCase() + currentBook.slice(1);
const text = document.getElementById("readerText" + idSuffix);
if (text) { text.style.fontSize = currentFontSize + "px"; } this.blur(); }); }); });
/* ---------- BOOKMARK ---------- */
document.querySelectorAll('[id="readerBookmarkBtn"]').forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentBook) {
            localStorage.setItem(
                "bookmark_" + currentBook,
                currentPage
            );
        }
    });
});

/* ------------------------------------------------------------
   WINDOW LOAD
------------------------------------------------------------ */
window.addEventListener('load', () => { loadVoices(); });

/* ------------------------------------------------------------
   SWITCH COVER IMAGE MOBILE
------------------------------------------------------------ */
   function switchCoverImage(){
   const isMobile = window.innerWidth <= 768; const books = ['emily', 'stars', 'hour', 'magi'];
   books.forEach(book => { const img = document.querySelector(`#${book}-poster .poster-img`);
   if(!img) return; if(isMobile){

// MOBILE: Gamitin yung library cover - walang putol
   img.src = `images/${book}.jpg`; } else {
// DESKTOP: Landscape pa rin
   img.src = `images/${book}-cover.jpg`; } }); }

// TATAKBO PAG NAGLOAD YUNG PAGE
   window.addEventListener('load', switchCoverImage);
// TATAKBO DIN PAG NAG-RESIZE NG SCREEN/INI-ROTATE YUNG PHONE
   window.addEventListener('resize', switchCoverImage);

/* ------------------------------------------------------------
   SETUP BUTTONS
------------------------------------------------------------ */
/*setupAllBookButtons()
• Kino-connect lahat ng Previous buttons
• Kino-connect lahat ng Next buttons
• Tinatawag isang beses lang pag ready na ang page*/