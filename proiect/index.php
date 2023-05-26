<?php
session_start();

include("config.php");
include("functions.php");

$user_data = check_login($con);
?>


<!DOCTYPE html>
<html>

<head>
   <meta charset="utf-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link rel="icon" type="image/gif" href="favicon.gif">

   <link rel="stylesheet" href="topnav.css">
   <link rel="stylesheet" href="homecanvas.css">

   <title>Webxel LevEdit</title>
</head>

<body>

   <div class="upload-field">
      <input class="file " type="file" id="myFile" name="filename">
      <br>
      <button type="export" class="export-btn">Save as JSON file</button>
      <br>
      <select name="options" id="options">
         <option value="8">Player</option>
         <option value="7">Gem</option>
         <option value="5">Gate</option>
         <option value="4">Wall</option>
         <option value="3">Box</option>
         <option value="2">Button</option>
      </select>
      <br>
      <p>x:</p>
      <input type="text" id="xInput" style="width: 40px" onkeypress='return event.charCode >= 48 && event.charCode <= 57'></input>

      <p>y:</p>
      <input type="text" id="yInput" style="width: 40px" onkeypress='return event.charCode >= 48 && event.charCode <= 57'></input>

      <button type="add" id="addButton" class="add-btn">Add</button>
      <button type="remove" id="removeButton" class="remove-btn">Remove</button>
      <button id="testButton">Test</button>
   </div>

   <div class="gradient"></div>
   <div class="vignette"></div>
   <nav id="topnav">
      <img src="images/logo.png" class="logo" height="40px">
      <div class="buttons">
         <a id="about" class="nav-link" href="logout.php">Log out</a>
         <a id="about" class="nav-link"> <?php echo $user_data['user_name']; ?></a>
      </div>
   </nav>
   <canvas id="canvas"></canvas>
   <p id="scoreDisplay"></p>
   <button id="muteButton"></button>
   <script src="game.js"></script>

</body>

</html>