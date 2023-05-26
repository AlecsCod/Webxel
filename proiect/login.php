<?php

session_start();

include("config.php");
include("functions.php");


if ($_SERVER['REQUEST_METHOD'] == "POST") {
	//ceva a fost postat
	$user_name = $_POST['user_name'];
	$password = $_POST['password'];

	if (!empty($user_name) && !empty($password) && !is_numeric($user_name)) {

		//citeste din database
		$query = "select * from users where user_name = '$user_name' limit 1";
		$result = mysqli_query($con, $query);

		if ($result) {
			if ($result && mysqli_num_rows($result) > 0) {

				$user_data = mysqli_fetch_assoc($result);

				if ($user_data['password'] === $password) {

					$_SESSION['user_id'] = $user_data['user_id'];
					header("Location: index.php");
					die;
				}
			}
		}

		echo "<p class='error'>Wrong username or password!</p>";
	} else {
		echo "<p class='error'>Wrong username or password!</p>";
	}
}

?>
<style>
	.error {
		color: red;
		background-color: #e0e0e0;
		text-align: center;
	}
</style>


<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="icon" type="image/gif" href="favicon.gif">

	<title>Webxel | Log in!</title>
	<link rel="stylesheet" href="style.css">
</head>

<body>
	<div class="gradient"></div>
	<div class="vignette"></div>
	<div class="hero">
		<div class="form-box">
			<div class="logo">
				<img src="images/logo.png" width="320px" height="80px">
			</div>
			<div class="charwalk">
				<marquee behavior="scroll" direction="right" scrollamount="12" width="480px">
					<img src="images/walk.gif" width="80px" height="80px">
				</marquee>
			</div>
			<form action="" method="post" id="login" class="input-group">
				<input type="text" name="user_name" class="input-field" placeholder="Username" required>
				<input type="password" name="password" class="input-field" placeholder="Password" required>

				<input type="checkbox" class="check-box"><span>Remember Password</span>

				<button type="submit" value="Login" class="submit-btn">
					<p>Log in</p>
				</button>

				<p><a href="registration.php" class="text-btn">Don't have an account? Register here.</a></p>
			</form>

		</div>
	</div>
</body>

</html>