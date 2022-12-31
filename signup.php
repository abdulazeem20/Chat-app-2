<?php
require_once __DIR__ . '/src/session.php';
?>
<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Chat</title>
        <link rel="stylesheet" href="http://localhost:100/bootstrap.min.css">
        <link rel="stylesheet" href="http://localhost:100/fontawesome/css/all.min.css">
        <link rel="stylesheet" href="./assets/style/signup.css">
    </head>

    <body>

        <section id="wrapper">
            <form action="" id="signupForm" method="POST">
                <div id="header">
                    My Chat
                </div>
                <input type="text" class="form-control" name="username" id="" placeholder="Username">
                <input type="email" class="form-control" name="email" id="" placeholder="Email">
                <div class="gender">
                    <p>Gender :</p>
                    <label for="male">Male</label>
                    <input type="radio" name="gender" value="M" id="male" checked>
                    <label for="female">Female</label>
                    <input type="radio" name="gender" value="F" id="female">
                </div>
                <input type="password" class="form-control" name="password" placeholder="Password" id="">
                <input type="password" class="form-control" name="password2" placeholder="Confirm Password" id="">
                <div class="formButtom">
                    <button type="submit" id="signup" class="btn">Sign Up</button>
                    <p>Already have an Account Sign in <a href="/signin.php" class="">here</a></p>
                </div>
            </form>
        </section>

        <script src="http://localhost:100/jquery.js"></script>
        <script src="http://localhost:100/proper.js"></script>
        <script src="http://localhost:100/bootstrap.min.js"></script>
        <script src="http://localhost:100/fontawesome/js/all.min.js"></script>
        <script src="./assets/script/signup.js"></script>
    </body>

</html>