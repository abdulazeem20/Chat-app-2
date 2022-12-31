<?php

class User
{
    public function __construct($props = [])
    {
        $this->props = $props;
    }

    public function register()
    {
        $query = "INSERT INTO users(username,email,password,gender) VALUES(:username,:email,:password,:gender)";
        $insert = $GLOBALS['db']->insert($query, $this->props);
        return $insert;
    }

    public function login()
    {
        $query = "SELECT * FROM users WHERE username = :username";
        $login = $GLOBALS['db']->fetch($query, $this->props);
        return $login;
    }

    public function fetchMyDetails()
    {
        $query = "SELECT * FROM users WHERE id = :id";
        return $GLOBALS['db']->fetch($query, $this->props);
    }
    public function fetchAllUser()
    {
        $query = "SELECT * FROM users WHERE id != :id";
        return $GLOBALS['db']->fetchAll($query, $this->props);
    }
    public function updateUser()
    {
        $query = "UPDATE users SET username=:username ,password=:password, gender=:gender, email = :email WHERE id = :id";
        return $GLOBALS['db']->insert($query, $this->props);
    }
    public function updateImage()
    {
        $query = "UPDATE users SET image=:image  WHERE id = :id";
        return $GLOBALS['db']->insert($query, $this->props);
    }
}
