<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">

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
                <form id="login" class="input-group">
                    <input name="user" id="user" type="text" class="input-field" placeholder="Username" required>
                    <input name="user" id="pass" type="password" class="input-field" placeholder="Password" required>

                    <input type="checkbox" class="check-box" ><span>Remember Password</span>

                    <button name="submit" id="btn" type="submit" class="submit-btn" value="Login">
                        <p>Log in</p>
                    </button>
                    
                    <p><a href="registration.html"  class="text-btn">Don't have an account? Register here.</a></p>
                </form>

            </div>
        </div>
    </body>
</html>