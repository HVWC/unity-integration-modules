<article<?php print $attributes; ?>>
  <?php print $user_picture; ?>
  <?php print render($title_prefix); ?>
  <?php if (!$page && $title): ?>
  <header>
    <h2<?php print $title_attributes; ?>><a href="<?php print $node_url; ?>" title="<?php print $title; ?>"><?php print $title; ?></a></h2>
  </header>
  <?php endif; ?>
  <?php print render($title_suffix); ?>
  <?php if ($display_submitted): ?>
  <?php endif; ?>  
  <div<?php print $content_attributes; ?>>
  <input type="hidden" value="<?php print $default_unity_file_source; ?>" id="unity-source"/>  
  <div class="world-window-container split-screen">
    <div class="top-info">
      <span class="tour-title"></span>
      <div class="placard-title-dropdown-container">
        <span class="prev-link-container">
          <a href="#" class="placard-nav nav-prev">prev</a>
        </span>
        <span class="placard-title"></span>
        <span class="next-link-container">
          <a href="#" class="placard-nav nav-next">next</a>
        </span>
      <ul class="placard-dropdown-list">
        <li class="placard-item"></li>
      </ul>
      </div>
      <div class="world-window-size-option">
        <a href="#" title = "Full Screen" class="show-full-world-window-btn">Full</a>
        <a href="#" title = "Split Screen" class="show-split-screen-world-window-btn">Split</a>
      </div>
    </div>
    <div class="unity-content-container">
      <img id="loading-indicator" src='sites/all/modules/custom/unity-integration-modules/custom_unity/images/loading.gif'>
      <div id="unityPlayer">
        <!-- unity web player -->
        <div class="template-wrap clear">
          <canvas class="emscripten" id="canvas" oncontextmenu="event.preventDefault()"></canvas>
          <script>
            var Module = {
              TOTAL_MEMORY: 268435456,
              errorhandler: null,
              compatibilitycheck: null,
              dataUrl: '<?php print $unity_data_file; ?>',
              codeUrl: '<?php print $unity_js_file; ?>',
              memUrl: '<?php print $unity_mem_file; ?>'
            };
          </script>
          <script src="<?php print $unity_loader_file; ?>"></script>
          <br>
          <div class="logo"></div>
          <div class="fullscreen"><img src="<?php print $unity_assets_dir ?>/fullscreen.png" width="38" height="38" alt="Fullscreen" title="Fullscreen" onclick="SetFullscreen(1);" /></div>
        </div>
        <!-- unity web player -->
      </div>
    </div>
    <?php
      // We hide the comments and links now so that we can render them later.
      hide($content['comments']);
      hide($content['links']);
      print render($content);
    ?>
  </div>
  <div class="information-window-container split-screen">
    <div class="side-bar-action-container">
      <div class="information-window-size-option">
        <a href="#" title = "Full Screen" class="show-full-information-window-btn">Full</a>
        <a href="#" title = "Split Screen" class="show-split-screen-information-window-btn">Split</a>
      </div>
    </div>
  </div>
  </div>
  <div class="clearfix">
    <?php if (!empty($content['links'])): ?>
      <nav class="links node-links clearfix"><?php print render($content['links']); ?></nav>
    <?php endif; ?>
    <?php print render($content['comments']); ?>
  </div>
</article>
