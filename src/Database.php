<?php

class Database
{
    public function __construct()
    {
        $this->conn = $this->connect();
    }

    private function connect()
    {
        try {
            $dsn = 'mysql:host=' . DBHOST . ';dbname=' . DBNAME;
            $pdo = new PDO($dsn, DBUSER, DBPASS);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // echo ('Connection Sucessful');
            return $pdo;
        } catch (PDOException $e) {
            // echo $e->getMessage();
        }
    }

    private function setPrepared($data = [])
    {
        $result = [];
        foreach ($data as $key => $item) {
            $result[':' . $key] = $item;
        }
        return $result;
    }

    public function insert($query, $data = [])
    {
        try {
            $stmt = $this->conn->prepare($query);
            $sanitizedData = $this->setPrepared($data);
            $stmt->execute($sanitizedData);
            return true;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public function fetch($query, $data = [])
    {
        try {
            $stmt = $this->conn->prepare($query);
            $sanitizedData = $this->setPrepared($data);
            $stmt->execute($sanitizedData);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
    public function fetchAll($query, $data = [])
    {
        try {
            $stmt = $this->conn->prepare($query);
            $sanitizedData = $this->setPrepared($data);
            $stmt->execute($sanitizedData);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
    public function checkIfExists($query, $data = [])
    {
        try {
            $stmt = $this->conn->prepare($query);
            $sanitizedData = $this->setPrepared($data);
            $stmt->execute($sanitizedData);
            return $stmt->fetch(PDO::FETCH_COLUMN);
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
}
