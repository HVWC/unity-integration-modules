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
      </div>
      <div class="world-window-size-option">
        <a href="#" title = "Full Screen" class="show-full-world-window-btn">Full</a>
        <a href="#" title = "Split Screen" class="show-split-screen-world-window-btn">Split</a>
      </div>
    </div>
    <div class="unity-content-container">
      <div id="unityPlayer">
        <div class="missing">
          <a href="http://unity3d.com/webplayer/" title="Unity Web Player. Install now!">
            <img alt="Unity Web Player. Install now!" src="http://webplayer.unity3d.com/installation/getunity.png" width="193" height="63" />
          </a>
        </div>
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
      <div class="placard-title-dropdown-container">
        <span class="placard-title"></span>
          <ul class="placard-dropdown-list">
            <li class="placard-item"></li>
          </ul>
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