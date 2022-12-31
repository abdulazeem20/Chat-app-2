<?php
class Auth
{
    public function __construct($props = [])
    {
        $this->props = $props;
    }

    public function emptyField()
    {
        if (count($this->checkEmpty()) > 0) {
            echo json_encode([
                'message' => 'Field Empty',
                'status' => 'error'
            ]);
            return true;
        }
        return false;
    }

    public function validateEmail()
    {
        if (!filter_var($this->props['email'], FILTER_VALIDATE_EMAIL)) {
            echo json_encode([
                'message' => 'Invalid Emial Address',
                'status' => 'error'
            ]);
            return true;
        }
        return false;
    }

    public function checkUsernameLength()
    {
        if (strlen($this->props['username']) < 3 || strlen($this->props['username']) > 8) {
            echo json_encode([
                'message' => 'Username Length Must be between 3 and 8',
                'status' => 'error'
            ]);
            return true;
        }
        return false;
    }
    public function checkPasswordLength()
    {
        if (strlen($this->props['password']) < 3 || strlen($this->props['password']) > 8) {
            echo json_encode([
                'message' => 'Password Length Must be between 3 and 8',
                'status' => 'error'
            ]);
            return true;
        }
        return false;
    }

    public function checkIfExists($field)
    {
        $data['props'] = $this->props[$field];
        $query = "SELECT COUNT(*) FROM users WHERE $field = :props";
        $exists = $GLOBALS['db']->checkIfExists($query, $data);
        if ($exists != 0) {
            echo json_encode([
                'message' => ucfirst($field) . " Already exists",
                'status' => 'error'
            ]);
            return true;
        }
        return false;
    }


    public function confirmBothPassword()
    {
        if ($this->props['password'] !== $this->props['password2']) {
            echo json_encode([
                'message' => 'Password Mismatch',
                'status' => 'error'
            ]);
            return true;
        }
        return false;
    }

    private function checkEmpty()
    {
        $emptyData = array_filter($this->props, function ($value) {
            return empty($value);
        });
        return $emptyData;
    }

    public function removePart($removed)
    {
        foreach ($removed as $item) {
            if (array_key_exists($item, $this->props)) {
                unset($this->props[$item]);
            }
        }
        return $this->props;
    }
}
