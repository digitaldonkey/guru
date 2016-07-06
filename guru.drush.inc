<?php
/**
 * @file
 * Drush implementation to generate subthemes.
 */

use Symfony\Component\Yaml\Yaml;

/**
 * Implements drush function defined in guru.drush.yml.
 */
function drush_guru_subtheme($name) {

  /*
   * Machine name.
   */
  // Try to generate a machine-readable name. If that fails, prompt for one.
  if (!$machine_name = drush_get_option('machine-name', drush_guru_generate_theme_name($name))) {
    drush_print(dt("Sorry, I couldn't generate a machine-readable name for @name. Please use the '--machine-name' option to specify it manually.\n", array(
      '@name' => $name,
    )));
  }
  drush_print(dt("Theme machine-readable name:\n  @name", array(
    '@name' => $machine_name,
  )));

  /*
   * Destination path.
   */
  $destination = DRUPAL_ROOT . DIRECTORY_SEPARATOR . drush_get_option('destination', 'themes') . DIRECTORY_SEPARATOR . $machine_name;
  if (file_exists($destination)) {
    return drush_set_error('GURU_SUBTHEME_PATH', dt('The path @path already exists.', array('@path' => $destination)));
  }
  drush_print(dt("\nTheme destination:\n @path", array(
    '@path' => $destination,
  )));

  /*
   * Prepare in temporary directory.
   * We don't leave any stale files if an operation fails.
   */
  $tmp_theme_path = drush_tempdir() . DIRECTORY_SEPARATOR . $machine_name . DIRECTORY_SEPARATOR;
  if (!mkdir($tmp_theme_path)) {
    return drush_set_error('GURU_CREATE_ERROR', dt('Could not create @path.', array('@path' => $tmp_theme_path)));
  }

  /*
   * Generate theme.info.yml file.
   */
  // Sadly I don't find a way to work with YAML files keeping comments of the
  // base template. _guru_write_yaml_config() let us keep the comments.
  $base_theme_yaml = __DIR__ . '/guru.info.yml';
  $yaml = Yaml::parse(file_get_contents($base_theme_yaml));

  $yaml['name'] = $name;
  $yaml['base theme'] = 'guru';
  $yaml['libraries'] = array(
    $machine_name . '/global-styling',
  );

  $new_theme_yaml = $tmp_theme_path . $machine_name . '.info.yml';
  if (!_guru_write_yaml_config($yaml, $base_theme_yaml, $new_theme_yaml)) {
    return drush_set_error('GURU_CREATE_ERROR', dt('Could not copy @file. to @destination', array('@file' => $base_theme_yaml, '@destination' => $new_theme_yaml)));
  }

  // Libraries require renaming.
  $base_theme_libraries_path = __DIR__ . '/guru.libraries.yml';
  $libraries_path = $tmp_theme_path . '/' . $machine_name . '.libraries.yml';
  if (!copy($base_theme_libraries_path, $libraries_path)) {
    return drush_set_error('GURU_CREATE_ERROR', dt('Could not copy @file. to @destination', array('@file' => $base_theme_libraries_path, '@destination' => $libraries_path)));
  }

  /*
   * Copy theme files.
   */

  // Directories created in destination theme.
  $dirs = array(
    'css',
    'js',
    'scss',
    'styleguide-template',
    'templates',
  );

  foreach ($dirs as $dir) {
    $path = $tmp_theme_path . $dir;
    if (!mkdir($path)) {
      return drush_set_error('GURU_CREATE_ERROR', dt('Could not create @path.', array('@path' => $path)));
    }
  }

  // Files that will be copied to destination theme.
  // Relative to base_theme
  // Use "path/*" to copy directories recursive.
  $files = array(
    'css/.gitkeep',
    'config/*',
    'gulp-tasks/*',
    'gulp-templates/*',
    'js/behaviors.js',
    'scss/*',
    'styleguide-template/*',
    'svg/*',
    'templates/*',
    '.gitignore',
    'browsersync-client-events.js',
    'bower.json',
    'gulp.config.js',
    'gulpfile.js',
    // 'guru.theme', --> We just load the library it from the base theme!
    'kss-readme.md',
    'logo.svg',
    'package.json',
    'README.md',
    'scsslint-drupal.yml',
    'sasslint-drupal.yml',
  );

  foreach ($files as $file) {
    $is_recursive = strpos($file, '/*');
    if ($is_recursive == FALSE) {
      // Copy File.
      $source = __DIR__ . DIRECTORY_SEPARATOR . $file;

      if (!copy($source, $tmp_theme_path . $file)) {
        return drush_set_error('GURU_CREATE_ERROR', dt('Could not copy @file. to @destination', array('@file' => $source, '@destination' => $tmp_theme_path . $file)));
      }
    }
    else {
      // Copy all Files recursive.
      $file = substr($file, 0, strpos($file, '/*'));
      $source = __DIR__ . DIRECTORY_SEPARATOR . $file;
      if (!_guru_dir_copy_recursive($source, $tmp_theme_path . $file)) {
        return drush_set_error('GURU_CREATE_ERROR', dt('Could not copy @file. to @destination', array('@file' => $source, '@destination' => $tmp_theme_path . $file)));
      }

    }
  }

  // Rename config/install/guru.settings.yml:
  $settings_src = $tmp_theme_path . '/' . 'config/install/guru.settings.yml';
  $settings_dest = $tmp_theme_path . '/config/install/' . $machine_name . '.settings.yml';
  if (!rename($settings_src, $settings_dest)) {
    return drush_set_error('GURU_CREATE_ERROR', dt('Could not rename @file. to @destination', array('@file' => $settings_src, '@destination' => $settings_dest)));
  }

  /*
   * Copy files to destination.
   */
  if (!_guru_dir_copy_recursive($tmp_theme_path, $destination)) {
    return drush_set_error('GURU_CREATE_ERROR', dt('Could not copy @file. to @destination', array('@file' => $tmp_theme_path, '@destination' => $destination)));
  }

  /*
   * Remove temporary files.
   */
  if (!_guru_del_directory($tmp_theme_path)) {
    return drush_set_error('GURU_CREATE_ERROR', dt('Could delete directory @directory.', array('@directory' => $tmp_theme_path)));
  }

  /*
   * Give some Feedback on what we created.
   */
  $changed_files = array();
  _guru_dir_contents($destination, $changed_files);
  foreach ($changed_files as $k => $file) {
    $changed_files[$k] = ' ' . substr($file, strlen($destination) + 1);
  }
  drush_print(dt("## Files copied or created ##", array()));
  drush_print(implode("\n", $changed_files));

  return TRUE;
}


/**
 * Implements drush_hook_COMMAND_validate().
 *
 * @param string $name
 *   Human readable theme name.
 */
function drush_guru_guru_subtheme_validate($name = NULL) {

  $theme_handler = \Drupal::service('theme_handler');
  /*
   * D8 changes see: https://www.drupal.org/node/2150863
   * $themes = $theme_handler->listInfo();  // Get a list of available themes.
   * $theme_handler->enable($theme_list); // Enable themes.
   * $theme_handler->disable($theme_list); // Disable themes.
   * $theme_handler->getBaseThemes($themes, $key);
   * Find base themes for a theme.
   * $theme_handler->rebuildThemeData();
   * Rebuild, save, and return data about all currently available themes.
   */

  if (!isset($name)) {
    return drush_set_error('GURU_MISSING_ARGUMENT', dt("You didn't specify a name for the subtheme."));
  }

  // Rebuild the theme data so that we can safely check for the existence of
  // themes by using the information provided by rebuildThemeData().
  $theme_handler->rebuildThemeData();

  if ($machine_name = drush_get_option('machine-name')) {
    // Validate the machine-readable name of the theme.
    if (!is_string($machine_name)) {
      return drush_set_error('GURU_THEME_NAME_INVALID', dt('The --machine-name option expects a string value.'));
    }

    if (!preg_match('/^[a-z][a-z0-9_]*$/', $machine_name)) {
      return drush_set_error('GURU_THEME_NAME_INVALID', dt('The machine name (@name) is invalid. It may only contain lowercase numbers, letters and underscores and must start with a letter.', array(
        '@name' => $machine_name,
      )));
    }

    $themes = $theme_handler->listInfo();

    // Validate that the machine-readable name of the theme is unique.
    if (isset($themes[$machine_name])) {
      return drush_set_error('GURU_THEME_ALREADY_EXISTS', dt('A theme with the name @name already exists. The machine-readable name must be unique.', array(
        '@name' => $machine_name,
      )));
    }
  }
  // Check if the provided destination exists.
  $destination = drush_get_option('destination', 'themes');
  if (!is_string($destination)) {
    return drush_set_error('GURU_DESTINATION_INVALID', dt('The --destination option expects a string value.'));
  }

  if ($basetheme = drush_get_option('basetheme')) {
    if (!is_string($basetheme)) {
      return drush_set_error('GURU_INVALID', dt('The --basetheme option expects a string value.'));
    }

    // Check if the base theme exists.
    if (!array_key_exists($basetheme, $theme_handler->listInfo())) {
      return drush_set_error('GURU_DOES_NOT_EXIST', dt('The base theme @basetheme does not exist or is invalid.', array(
        '@basetheme' => $basetheme,
      )));
    }
  }
  return TRUE;
}


/**
 * Implements hook_drush_command().
 *
 * Drush commands are defined in yml file.
 * See:
 * http://blog.riff.org/2015_10_23_drupal_8_tip_of_the_day_replace_hook_drush_command_by_a_yaml_file.
 */
function guru_drush_command() {
  $file = preg_replace('/(inc|php)$/', 'yml', __FILE__);
  $config = Yaml::parse(file_get_contents($file));
  $items = $config['commands'];
  return $items;
}

/**
 * Generates a valid machine-readable name for a theme from any string.
 *
 * @param string $string
 *   The string to generate the machine-readable name from.
 *
 * @return string
 *   The generated machine-readable name.
 */
function drush_guru_generate_theme_name($string) {
  // Machine-readable names have to start with a lowercase letter.
  $string = preg_replace('/^[^a-z]+/', '', strtolower($string));
  // Machine-readable names may only contain alphanumeric characters and
  // underscores.
  $string = preg_replace('/[^a-z0-9_]+/', '_', $string);
  // Trim all trailing and leading underscores.
  $string = trim($string, '_');

  $theme_handler = \Drupal::service('theme_handler');
  $themes = $theme_handler->listInfo();

  if (isset($themes[$string])) {
    $plain = $string;
    $counter = 0;

    while (isset($themes[$string])) {
      // Make sure that the machine-readable name of the theme is unique.
      $string = $plain . '_' . $counter++;
    }
  }
  drush_print(dt("Generated a machine-readable name:\n  @name\n", array(
    '@name' => $string,
  )));
  return $string;
}


/**
 * Change Yaml file properties.
 *
 * This Function takes a YAML file and writes a new file with the new Values
 * provided by $yaml, which should be derived from the template file.
 * Experimental: Currently only tested with the guru.info.yml.
 *
 * For YAML file definition see:
 * http://docs.ansible.com/ansible/YAMLSyntax.html
 *
 * @param array $yaml
 *   Set values in the Yaml File overwriting existing ones.
 *   $yaml = Yaml::parse(file_get_contents($yaml_template).
 * @param string $yaml_template
 *   Path to source and template YAML file.
 * @param string $save_to
 *   Path where YAML file should be saved to.
 *
 * @return bool
 *   Successful or not.
 */
function _guru_write_yaml_config(array &$yaml, $yaml_template, $save_to) {

  $yaml_file_array = file($yaml_template);

  foreach ($yaml_file_array as $l => $line) {

    // Required for List values.
    $prefix = FALSE;

    $split_line = explode(':', $line, 2);
    if (isset($yaml[$split_line[0]])) {
      $value = $yaml[$split_line[0]];

      if (!is_array($value)) {
        // A dictionary value
        // It is represented in a simple "key: value" form.
        // The colon must be followed by a space.
        $yaml_file_array[$l] = preg_replace("/\r|\n/", "", $split_line[0]) . ': ' . $yaml[$split_line[0]] . "\n";
      }
      else {

        // List values and associative List values.
        $remove_lines = array();
        $next_line = ($l + 1);
        while ($next_line) {
          $split_next = explode('- ', $yaml_file_array[$next_line], 2);
          $prefix = $split_next[0];

          // List Values.
          // are lines beginning at the same indentation level
          // starting with a "- " (a dash and a space):
          if (count($split_next) === 2) {
            $remove_lines[] = $next_line;
            $next_line++;
          }

          // Associative ist values.
          elseif (count($split_next) === 1) {

            $prefix__2 = FALSE;
            $split_next = explode(': ', $yaml_file_array[$next_line], 2);

            // Calculate prefix (spaces only).
            if (count($split_next) === 2) {
              $prefix__2 = substr($split_next[0], 0, -strlen(trim($split_next[0])));
            }

            if (is_string($prefix__2) && strlen($prefix__2) >= 1) {
              $key = $split_line[0];

              // Prepare values.
              $sub_values = array();
              foreach ($yaml[$key] as $k => $v) {
                $sub_values[] = $prefix__2 . $k . ": '" . $v . "'\n";
              }
              $value = $sub_values;
              $remove_lines[] = $next_line;
              $next_line++;
            }
            else {
              $next_line = FALSE;
            }
          }
          else {
            $next_line = FALSE;
          }
        }

        // Prepare Values.
        if ($prefix) {
          foreach ($value as $k => $v) {
            $value[$k] = preg_replace("/\r|\n/", "", $prefix) . "- " . preg_replace("/\r|\n/", "", trim($v)) . "\n";
          }
        }
        // Replacing lines prepared above.
        array_splice($yaml_file_array, $remove_lines[0], count($remove_lines), $value);
      }
    }

  }
  $new_yaml_file = implode('', $yaml_file_array);

  $info = "\nGenerated theme.info.yml:\n";
  $info .= "########################\n";
  $info .= $new_yaml_file;
  $info .= "########################\n";

  if (!is_int(file_put_contents($save_to, $new_yaml_file))) {
    return drush_set_error('GURU_CREATE_ERROR', dt('Could not write config file @path.', array('@path' => $save_to)));
  }

  drush_print($info);
  return TRUE;
}

/*
 * Helper functions below.
 */

/**
 * Recursively copy files from one directory to another.
 *
 * @param string $src
 *   Source of files being moved.
 * @param string $dest
 *   Destination of files being moved.
 *
 * @return bool
 *   Successful or not.
 */
function _guru_dir_copy_recursive($src, $dest) {

  // If source is not a directory stop processing.
  if (!is_dir($src)) {
    return FALSE;
  }

  // If the destination directory does not exist create it.
  if (!is_dir($dest)) {
    if (!mkdir($dest)) {
      // If the destination directory could not be created stop processing.
      return FALSE;
    }
  }
  $i = new DirectoryIterator($src);
  foreach ($i as $f) {
    if ($f->isFile()) {
      copy($f->getRealPath(), "$dest/" . $f->getFilename());
    }
    elseif (!$f->isDot() && $f->isDir()) {
      _guru_dir_copy_recursive($f->getRealPath(), "$dest/$f");
    }
  }
  return TRUE;
}

/**
 * Recursively copy files from one directory to another.
 *
 * @param string $dir
 *   Source of file three to visualize.
 * @param array $results
 *   Results.
 *
 * @return bool
 *   Successful or not.
 */
function _guru_dir_contents($dir, &$results = array()) {
  $files = scandir($dir);
  foreach ($files as $key => $value) {
    $path = realpath($dir . DIRECTORY_SEPARATOR . $value);
    if (!is_dir($path)) {
      $results[] = $path;
    }
    elseif (is_dir($path) && $value != "." && $value != "..") {
      _guru_dir_contents($path, $results);
    }
  }
  return $results;
}

/**
 * Recursively delete.
 *
 * @param string $dir
 *   Directory to delete.
 *
 * @return bool
 *   Successful or not.
 */
function _guru_del_directory($dir) {
  $files = array_diff(scandir($dir), array('.', '..'));
  foreach ($files as $file) {
    (is_dir("$dir/$file")) ? _guru_del_directory("$dir/$file") : unlink("$dir/$file");
  }
  return rmdir($dir);
}
