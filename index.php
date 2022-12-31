<?php
session_start();
if (!isset($_SESSION['id'])) {
    header('Location: signin.php');
}
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
        <link rel="stylesheet" href="./assets/style/style.css">
    </head>

    <body>
        <section id="wrapper">
            <div class="loader">
                <img src="./assets/icons/giphy.gif" alt="">
            </div>
            <div id="left_panel">
                <div id="sidebarInfo">
                    <img id="sidebarImage" src="" alt="profile image">
                    <p id="sidebarUsername"></p>
                    <p id="sidebarEmail"></p>
                </div>
                <div id="sidebarButton">
                    <button id="chat" type="button">Chat <span><i class="fas fa-comment"></i></span></button>
                    <button id="contact" type="button">Contact <span><i class="fas fa-address-book"></i></span></button>
                    <button id="setting" type="button">Settings <span><i class="fas fa-cog"></i></span></button>
                    <button id="logout" type="button">Logout <span><i class="fas fa-power-off"></i></span></button>
                </div>
            </div>
            <div id="right_panel">
                <div id="header">
                    My Chat
                </div>
                <div id="container">

                    <div id="inner_left_panel">


                    </div>
                    <div id="inner_right_panel">

                    </div>
                </div>
            </div>
        </section>

        <script src="http://localhost:100/jquery.js"></script>
        <script src="http://localhost:100/proper.js"></script>
        <script src="http://localhost:100/bootstrap.min.js"></script>
        <script src="http://localhost:100/fontawesome/js/all.min.js"></script>
        <script src="./assets/script/scripts.js" type="module"></script>
    </body>

</html>