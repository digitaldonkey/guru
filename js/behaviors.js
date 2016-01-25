(function ($, window, Drupal, drupalSettings) {
  'use strict';

  /**
   * The recommended way for producing HTML markup through JavaScript is to write
   * theming functions. These are similiar to the theming functions that you might
   * know from 'phptemplate' (the default PHP templating engine used by most
   * Drupal themes including guru). JavaScript theme functions accept arguments
   * and can be overriden by sub-themes.
   *
   * In most cases, there is no good reason to NOT wrap your markup producing
   * JavaScript in a theme function.
   */
  //Drupal.theme.guruButton = function (path, title) {
  //  // Create an anchor element with jQuery.
  //  return $('<a href="' + path + '" title="' + title + '">' + title + '</a>');
  //};
  //
  ///**
  // * Behaviors are Drupal's way of applying JavaScript to a page. In short, the
  // * advantage of Behaviors over a simple 'document.ready()' lies in how it
  // * interacts with content loaded through Ajax. Opposed to the
  // * 'document.ready()' event which is only fired once when the page is
  // * initially loaded, behaviors get re-executed whenever something is added to
  // * the page through Ajax.
  // *
  // * You can attach as many behaviors as you wish. In fact, instead of overloading
  // * a single behavior with multiple, completely unrelated tasks you should create
  // * a separate behavior for every separate task.
  // *
  // * In most cases, there is no good reason to NOT wrap your JavaScript code in a
  // * behavior.
  // *
  // * @param context
  // *   The context for which the behavior is being executed. This is either the
  // *   full page or a piece of HTML that was just added through Ajax.
  // * @param settings
  // *   An array of settings (added through drupal_add_js()). Instead of accessing
  // *   Drupal.settings directly you should use this because of potential
  // *   modifications made by the Ajax callback that also produced 'context'.
  // */
  //Drupal.behaviors.digitalguruExampleBehavior = {
  //  attach: function (context, settings) {
  //    // By using the 'context' variable we make sure that our code only runs on
  //    // the relevant HTML. Furthermore, by using jQuery.once() we make sure that
  //    // we don't run the same piece of code for an HTML snippet that we already
  //    // processed previously. By using .once('foo') all processed elements will
  //    // get tagged with a 'foo-processed' class, causing all future invocations
  //    // of this behavior to ignore them.
  //    console.log($('#block-digitalguru-branding', context), 'attach: function');
  //
  //    $('#block-digitalguru-branding', context).once('foo').each(function() {
  //      // Since there is no once ID provided here, the key will be "once".
  //      var button = Drupal.theme('guruButton', 'http://drupal.org', 'Button Text: drupal.org');
  //      $(this).css({border: '1px solid green'})
  //             .after(button);
  //    });
  //  }
  //};

  /**
   * Renders a widget for displaying the current width of the browser.
   */

    Drupal.behaviors.guruBrowserWidth = {
      attach: function (context) {

        // Loading Data ?!
        //$('body', context).find('[data-guru-browser-width]').once('guru-browser-width').each(function() {
        //  // Do something to the elements.
        //});
        if ($('body').hasClass('user-logged-in')) {

          $('body', context).once('guru-browser-indicator').each(function () {

              var indicator = $('<div class="guru-browser-indicator" />').appendTo(this);

              // Bind to the window.resize event to continuously update the width.
              $(window).on('resize.guru-browser-indicator', function () {

                indicator.text($(this).width() + 'px');
              }).trigger('resize.guru-browser-indicator');

              $('.guru-browser-indicator', context).on('click', function () {
                $(window.document.body).toggleClass('is-touch-debug');
              });

            });
          }
        }
      };


})(jQuery, window, window.Drupal, window.drupalSettings);
