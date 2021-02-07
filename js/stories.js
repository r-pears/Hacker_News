'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteButton = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const favorited = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      ${showDeleteButton ? getDeleteButton() : ''}
      ${favorited ? heartStory(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Create delete button for story. */
function getDeleteButton() {
  return `
  <span class="trash">
    <i class="fas fa-trash-alt"></i>
  </span>`;
}

/** Delete story */
async function deleteStory(event) {
  console.debug('deleteStory');
  const $closestLi = $(event.target).closest('li');
  const storyId = $closestLi.attr('id');

  await storyList.removeStory(currentUser, storyId);
  await displayUserStories();
}

$userStories.on('click', '.trash', deleteStory);

/** Create favorite heart icon for story. */
function heartStory(story, user) {
  const isFavorite = user.checkFavorite(story);
  const heartShape = isFavorite ? 'fas' : 'far';
  return `
    <span class="heart">
      <i class="${heartShape} fa-heart"></i>
    </span>`;
}

/** Toggle favorite on and off on a story. */
async function toggleStoryFavorite(event) {
  console.debug(toggleStoryFavorite);

  const $target = $(event.target);
  const $closestLi = $target.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find((stor) => stor.storyId === storyId);

  if ($target.hasClass('fas')) {
    await currentUser.removeFavoriteStory(story);
    $target.closest('i').toggleClass('fas far');
  } else {
    await currentUser.addFavoriteStory(story);
    $target.closest('i').toggleClass('fas far');
  }
}

$storiesList.on('click', '.heart', toggleStoryFavorite);

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug('putStoriesOnPage');

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Submit new story with the story form. */
async function submitNewStory(event) {
  console.debug('submitNewStory');
  event.preventDefault();

  const title = $('#new-title').val();
  const url = $('#new-url').val();
  const author = $('#new-author').val();
  const username = currentUser.username;
  const storyData = { title, url, author, username };

  const storyResp = await storyList.addStory(currentUser, storyData);

  const $newStory = generateStoryMarkup(storyResp);
  $allStoriesList.prepend($newStory);

  $submitForm.slideUp('slow');
  $submitForm.trigger('reset');
}

$submitForm.on('submit', submitNewStory);

/** Only display the user's favorite stories. */
function displayFavoriteStories() {
  console.debug('displayFavoriteStories');
  $favoriteStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteStories.append(
      `<h2>You haven't saved any favorite stories yet!</h2>`
    );
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStories.append($story);
    }
  }
  $favoriteStories.show();
}

/** Only display the stories that the user has written. */
function displayUserStories() {
  console.debug('displayUserStories');
  $userStories.empty();

  if (currentUser.ownStories.length === 0) {
    $userStories.append(`<h2>You have not added any stories yet!</h2>`);
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $userStories.append($story);
    }
  }
  $userStories.show();
}
