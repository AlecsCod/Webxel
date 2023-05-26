<?php
session_start();

include("config.php");
include("functions.php");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    //ceva a fost postat
    $user_name = $_POST['user_name'];
    $password = $_POST['password'];

    if (!empty($user_name) && !empty($password) && !is_numeric($user_name)) {

        //salveaza datele in database
        $user_id = random_num(20);
        $query = "insert into users (user_id,user_name,password) values ('$user_id','$user_name','$password')";

        mysqli_query($con, $query);

        header("Location: login.php");
        die;
    } else {
        //eroare daca datele introduse sunt invalide
        echo "<p id='errorMsg' class='Error'>Please enter some valid information!</p>";
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
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/gif" href="favicon.gif">

    <title>Webxel | Register!</title>
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
            <form action="" method="post" id="register" class="input-group">
                <?php
                if (isset($error)) {
                    foreach ($error as $error) {
                        echo '<span class="error-msg">' . $error . '</span>';
                    }
                }
                ?>
                <input type="text" name="user_name" class="input-field" placeholder="Username" required>
                <input type="email" name="email" class="input-field" placeholder="Email" required>
                <input type="password" name="password" class="input-field" placeholder="Password" required>
                <input type="checkbox" class="check-box"><span>I agree to the terms and conditions.</span>

                <button type="submit" value="Signup" class="submit-btn">
                    <p>Register</p>
                </button>

                <p><a href="login.php" class="text-btn">Already have an account? Log in here.</a></p>
            </form>
        </div>
    </div>
</body>

</html>
<script>
    function hideMessage() {
        document.getElementById("errorMsg").style.display = "none";
    };
    setTimeout(hideMessage, 3000);
</script>