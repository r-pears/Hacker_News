'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug('navAllStories', evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug('navLoginClick', evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug('updateNavOnLogin');
  $('.main-nav-links').show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show the form to submit a new story, after clicking submit in the nav */
function submitStory(event) {
  console.debug('submitStory', event);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$('#nav-submit').on('click', submitStory);

/** Display only the user's favorited stories. */
function favoritedStories(event) {
  console.debug('favoritedStories', event);
  hidePageComponents();
  displayFavoriteStories();
}

$body.on('click', '#nav-favorites', favoritedStories);

/** Display only the stories written by the user. */
function userStories(event) {
  console.debug('userStories', event);
  hidePageComponents();
  displayUserStories();
  $userStories.show();
}

$body.on('click', '#nav-user-stories', userStories);

/** Show user profile. */

function showProfile(event) {
  console.debug('showProfile', event);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on('click', showProfile);
