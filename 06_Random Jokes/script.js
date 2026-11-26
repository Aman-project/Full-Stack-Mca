const categorySelect = document.getElementById('category-select');
const categoryBadge = document.getElementById('category-badge');
const loader = document.getElementById('loader');
const jokeSetup = document.getElementById('joke-setup');
const jokeDelivery = document.getElementById('joke-delivery');
const errorMsg = document.getElementById('error-msg');
const revealBtn = document.getElementById('reveal-btn');
const copyBtn = document.getElementById('copy-btn');
const newJokeBtn = document.getElementById('new-joke-btn');

let currentJokeText = '';

async function fetchRandomJoke() {
  const category = categorySelect.value;
  const endpoint = `https://v2.jokeapi.dev/joke/${encodeURIComponent(category)}?safe-mode`;

  loader.classList.remove('hidden');
  jokeSetup.classList.add('hidden');
  jokeDelivery.classList.add('hidden');
  errorMsg.classList.add('hidden');
  revealBtn.classList.add('hidden');
  newJokeBtn.disabled = true;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.message || 'Unable to retrieve a joke.');
    }

    categoryBadge.textContent = data.category;

    if (data.type === 'single') {
      jokeSetup.textContent = data.joke;
      jokeSetup.classList.remove('hidden');
      currentJokeText = data.joke;
    } else {
      jokeSetup.textContent = data.setup;
      jokeDelivery.textContent = data.delivery;
      jokeSetup.classList.remove('hidden');
      revealBtn.classList.remove('hidden');
      currentJokeText = `${data.setup}\n${data.delivery}`;
    }
  } catch (err) {
    errorMsg.textContent = 'Could not load a joke right now. Check your connection and try again.';
    errorMsg.classList.remove('hidden');
    currentJokeText = '';
  } finally {
    loader.classList.add('hidden');
    newJokeBtn.disabled = false;
  }
}

revealBtn.addEventListener('click', () => {
  jokeDelivery.classList.remove('hidden');
  revealBtn.classList.add('hidden');
});

copyBtn.addEventListener('click', async () => {
  if (!currentJokeText) return;
  try {
    await navigator.clipboard.writeText(currentJokeText);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1500);
  } catch {
    copyBtn.textContent = 'Failed';
  }
});

categorySelect.addEventListener('change', fetchRandomJoke);
newJokeBtn.addEventListener('click', fetchRandomJoke);

fetchRandomJoke();