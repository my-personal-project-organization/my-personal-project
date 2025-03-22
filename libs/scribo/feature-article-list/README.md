# feature-home

# Potential Additional Pages (within @mpp/scribo/feature-dashboard or separate libs):

Consider these, depending on your Scribo application's features:

## Welcome/Introduction:

Purpose: A brief introduction to Scribo, if the "dashboard" is more complex than just a simple welcome message.
Route: Could be part of the /scribo/dashboard route, or a separate /scribo/welcome route (only shown on first visit).
Library: Likely part of @mpp/scribo/feature-dashboard.

## Notifications:

Purpose: Displaying user notifications (new articles, comments, etc.).
Route: /scribo/notifications
Library: Could be part of @mpp/scribo/feature-dashboard if simple, or a separate @mpp/scribo/feature-notifications if more complex (e.g., notification settings).

## Search:

Purpose: Global search functionality within Scribo.
Route: /scribo/search
Library: Could be part of a shared UI library (if the search UI is reusable), or @mpp/scribo/feature-search if it has Scribo-specific logic.

## Article Creation/Editing:

Purpose: Forms for creating and editing articles.
Route: /scribo/create, /scribo/edit/:articleId
Library: Definitely a separate library: @mpp/scribo/feature-article-editor. This is a complex feature that should be isolated.

## Help/Documentation:

Purpose: Providing help documentation for Scribo.
Route: /scribo/help
Library: Could be part of @mpp/scribo/feature-dashboard if simple, or a separate library if extensive.

## Settings:

Purpose: If your app has settings.
Route /scribo/settings
Library: @mpp/scribo/feature-settings
