---
layout: base
title: Platformer Biotech Game
description: A cool platformer biotech game!
image: /images/platformer/backgrounds/home.png
permalink: /adventure
Author: Zach & Ian
---

<style>
  body {
    overflow-x: hidden; 
  }
</style>

<div id="sidebar" class="sidebar" style="z-index: 9999">
</div>
<div id="leaderboardDropDown" class="leaderboardDropDown" style="z-index: 9999">
</div>

<audio id="Mushroom" src="{{site.baseurl}}/assets/audio/Mushroom.mp3" preload="auto"></audio>

<audio id="goombaDeath" src="{{site.baseurl}}/assets/audio/goomba-death.mp3" preload="auto"></audio>

<audio id ="PlayerJump" src="{{site.baseurl}}/assets/audio/mario-jump.mp3" preload="auto"></audio>

<audio id ="PlayerDeath" src="{{site.baseurl}}/assets/audio/MarioDeath.mp3" preload="auto"></audio>

<audio id ="coin" src="{{site.baseurl}}/assets/audio/coin.mp3" preload="auto"></audio>

<audio id="everlong" src="{{site.baseurl}}/assets/audio/everlong.mp3" preload="auto"></audio>

<audio id="Scripps" src="{{site.baseurl}}/assets/audio/El_Gigante_De_Hierro.mp3" preload="auto"></audio>

<audio id="EARFQUAKE" src="{{site.baseurl}}/assets/audio/EARFQUAKE.mp3" preload="auto"></audio>

<audio id="Noid" src="{{site.baseurl}}/assets/audio/Noid.mp3" preload="auto"></audio>

<audio id="SeeYouAgain" src="{{site.baseurl}}/assets/audio/SeeYouAgain.mp3" preload="auto"></audio>

<audio id="WUSYANAME" src="{{site.baseurl}}/assets/audio/WUSYANAME.mp3" preload="auto"></audio>

<audio id="regicide" src="{{site.baseurl}}/assets/audio/regicide.mp3" preload="auto"></audio>

<audio id ="stomp" src="{{site.baseurl}}/assets/audio/stomp2-93279.mp3" preload="auto"></audio>

<audio id = "boing" src ="{{site.baseurl}}/assets/audio/boing-101318.mp3" preload="auto"></audio>

<audio id = "flush" src ="{{site.baseurl}}/assets/audio/toilet-flushing.mp3" preload="auto"></audio>

<audio id = "laserSound" src ="{{site.baseurl}}/assets/audio/laser.mp3" preload="auto"></audio>

<audio id = "laserCharge" src ="{{site.baseurl}}/assets/audio/charging-laser.mp3" preload="auto"></audio>

<div id="canvasContainer">
  <div class="submenu">
    <div id="score">
        Timer: <span id="timeScore">0</span>
    </div>
    <div id="score">
        Coins: <span id="coinScore">0</span>
    </div>
    <div id="gameBegin" hidden>
        <button id="startGame">Start Game</button>
    </div>
    <div id="gameOver" hidden>
        <button id="restartGame">Restart</button>
    </div>
    <div id="settings"> 
       <button id="settings-button">Settings</button>
    </div>
  </div>
</div>

<div id="container">
    <header class="fun_facts">
    <p id="num">Fun Fact #0</p>
    <h3 id="fun_fact">Scripps Research is a real research facility that involved the research of scripps!</h3> 
    </header>
  </div>

<footer id="cut-story"></footer>

<script type="module">
 
    import GameSetup from '{{site.baseurl}}/assets/js/platformer/GameSetup.js';
    import GameControl from '{{site.baseurl}}/assets/js/platformer/GameControl.js';
    import SettingsControl from '{{site.baseurl}}/assets/js/platformer/SettingsControl.js';
    import GameEnv from '{{site.baseurl}}/assets/js/platformer/GameEnv.js';
    import startCutstory from '{{site.baseurl}}/assets/js/platformer/Cutstory.js';;


    import RandomEvent from '{{site.baseurl}}/assets/js/platformer/RandomEvent.js';

    GameSetup.initLevels("{{site.baseurl}}");
   
   GameControl.gameLoop();

    

    
    SettingsControl.initialize();

    
    startCutstory();
    RandomEvent();

    

    window.addEventListener('resize', GameEnv.resize);

</script>
