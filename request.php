<?php
session_start();
require_once __DIR__ . './src/autoload.php';
$db = new Database();

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    if (isset($_POST['signup'])) {
        array_pop($_POST);
        $data = array_map('sanitizeString', $_POST);
        $auth = new Auth($data);
        if (
            !$auth->emptyField() &&
            !$auth->checkUsernameLength() &&
            !$auth->checkIfExists('username') &&
            !$auth->checkIfExists('email') &&
            !$auth->validateEmail() &&
            !$auth->checkPasswordLength() &&
            !$auth->confirmBothPassword()
        ) {
            $newData = $auth->removePart(['password2']);
            $user = new User($newData);
            $register = $user->register();
            if ($register) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Account Sucessfully Created'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'An Error Occured'
                ]);
            }
        };
    } else if (isset($_POST['signin'])) {
        array_pop($_POST);
        $data = array_map('sanitizeString', $_POST);
        $auth = new Auth($data);
        if (!$auth->emptyField()) {
            $password = $data['password'];
            $data = $auth->removePart(['password']);
            $user = new User($data);
            $login = $user->login();
            if (
                $login &&
                $login['password'] === $password
            ) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Redirecting ....'
                ]);
                $_SESSION['id'] = $login['id'];
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid Username and Password'
                ]);
            }
        }
    } else if (isset($_POST["info"])) {
        $data = ['id' => $_SESSION['id']];
        $user = new User($data);
        $info = $user->fetchMyDetails();
        echo json_encode([
            "email" => $info['email'],
            "username" => $info['username'],
            "image" => $info['image'],
            'gender' => $info['gender']
        ]);
    } else if (isset($_POST['logout'])) {
        session_destroy();
        echo json_encode([
            'logout' => true
        ]);
    } else if (isset($_POST['getContact'])) {
        $user = new User(['id' => $_SESSION['id']]);
        $message = new Message([
            'sender' => $_SESSION["id"]
        ]);
        $message->updateReceived();
        echo json_encode($user->fetchAllUser());
    } else if (isset($_POST['getSetting'])) {
        $user = new User(['id' => $_SESSION['id']]);
        echo json_encode($user->fetchMyDetails());
    } else if (isset($_POST['settingForm'])) {
        array_pop($_POST);
        $data = array_map('sanitizeString', $_POST);
        $auth = new Auth($data);
        if (
            !$auth->emptyField() &&
            !$auth->checkUsernameLength() &&
            !$auth->validateEmail() &&
            !$auth->checkIfExists('username') &&
            !$auth->checkPasswordLength() &&
            !$auth->confirmBothPassword()
        ) {
            $newData = $auth->removePart(['password2']);
            $newData['id'] = $_SESSION['id'];
            $user = new User($newData);
            $update = $user->updateUser();
            if ($update) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Account Sucessfully Updated'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'An Error Occured'
                ]);
            }
        };
    } else if (isset($_POST['changeProfileImage'])) {
        // print_r($_FILES);
        $data = [
            'uFileType' => $_FILES['file']['type'],
            'fileType' => ['image/png', 'image/jpeg', 'image/jpg'],
            'destination' => 'assets/images/',
            'fileName' => $_FILES['file']['name'],
            'fileTmp' => $_FILES['file']['tmp_name'],
            'fileNameP' => $_SESSION['id'] .
                rand(0, 200),
            'fileSize' => $_FILES['file']['size'],
            'expectedFileSize' => 100000
        ];
        $uploadedFile = new UploadedFile($data);
        if (
            !$uploadedFile->checkFileExtension() &&
            !$uploadedFile->checkFileSize() &&
            $uploadedFile->uploadFile()
        ) {
            $userP = new User(['id' => $_SESSION['id']]);
            $getMyDetail = $userP->fetchMyDetails();
            if (
                $getMyDetail['image'] !== null &&
                !unlink(__DIR__ . '/assets/images/' . $getMyDetail['image'])
            ) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'An Error Occured'
                ]);
            }
            $imageName = $uploadedFile->fileSavedName();
            $user = new User([
                'id' => $_SESSION['id'],
                'image' => $imageName,
            ]);
            $updateImage = $user->updateImage();
            if ($updateImage) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Image Updated Sucessfully'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'An Error Occured'
                ]);
            }
        }
    } else if (isset($_POST["startChat"])) {
        array_pop($_POST);
        // print_r($_POST);
        $data = array_map('sanitizeString', $_POST);
        $user = new User(['id' => $data['userId']]);
        $userDetail = $user->fetchMyDetails();
        if (!$userDetail) {
            echo json_encode([
                'status' => 'error'
            ]);
        } else {

            $data['sender'] = $_SESSION["id"];
            $message = new Message($data);
            $detail = $message->fetchMessage();
            // print_r($detail);
            if (!$detail) {
                $userDetail['receiverId'] = $userDetail['id'];
                $userDetail['receiverUsername'] = $userDetail['username'];
                $userDetail['receiverImage'] = $userDetail['image'];
                $detail = [$userDetail];
            }
            $detail['status'] = 'success';
            $detail['sender'] = $_SESSION['id'];
            $updateMessage = new Message([
                'userId' => $data['userId'],
                'sender' => $_SESSION["id"]
            ]);
            $updateMessage->updateSeen();
            // print_r($detail);
            echo json_encode($detail);
            return;
        }
    } else if (isset($_POST["sendMessage"])) {
        array_pop($_POST);
        $data = array_map('sanitizeString', $_POST);
        $data['sender'] = $_SESSION['id'];
        // print_r($data);
        $message = new Message($data);
        $message->saveMessage();
        echo json_encode(['status' => 'success']);
        // echo $message->messageId();
    } else if (isset($_POST["getLatestChat"])) {
        $data = ['sender' => $_SESSION["id"]];
        // print_r($data);
        $message = new Message($data);
        $message->updateReceived();
        $latestMessage = $message->latesstMessages();
        if (!$latestMessage) {
            echo json_encode([
                'status' => 'error'
            ]);
            return;
        }
        $latestMessage['status'] = 'success';
        $latestMessage['sender'] = $_SESSION["id"];
        // print_r($latestMessage);
        echo json_encode($latestMessage);
    }
}