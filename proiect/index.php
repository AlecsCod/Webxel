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
   <form class="upload-field">
<div>
<form>
  <input type="file" id="myFile" name="filename">
  <input type="submit">
</form>
<button type="export" class="export-btn">Export</button>
<select name="options" id="options">

</select>
<button type="add" class="add-btn">Add</button>
<button type="remove" class="remove-btn">Remove</button>
<button type="test" class="test-btn">Test</button>

</div>
   </form>
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