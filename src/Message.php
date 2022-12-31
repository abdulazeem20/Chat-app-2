<?php

class Message
{
    public function __construct($props = [])
    {
        $this->props = $props;
    }

    public function saveMessage()
    {
        $query = "INSERT INTO messages(msid,sender,message,receiver) VALUES(:msid,:sender,:message,:userId)";
        $this->props['msid'] = $this->messageId();
        $insert = $GLOBALS['db']->insert($query, $this->props);
        return $insert;
    }

    public function fetchMessage()
    {
        $query = "SELECT * FROM messages_view WHERE msid = :msid ORDER BY date ";
        $query2 = "SELECT COUNT(*) unreceived FROM messages_view WHERE received = 0 AND msid = :msid";
        $data = [
            'msid' => $this->messageId()
        ];
        // $unreceived = $GLOBALS['db']->fetchAll($query2, $data);
        $message = $GLOBALS['db']->fetchAll($query, $data);
        // $message['unreceived'] = $unreceived[0]['unreceived'];
        return $message;
    }

    public function messageId()
    {
        $messageId = [$this->props['sender'], $this->props['userId']];
        array_multisort($messageId);
        return md5(implode('', $messageId));
    }

    public function latesstMessages()
    {
        $query = "SELECT * FROM latestMessages WHERE senderId = :sender OR receiverId = :sender ORDER BY date DESC";
        // print_r($this->props);
        return $GLOBALS["db"]->fetchAll($query, $this->props);
    }
    public function updateReceived()
    {
        $query = "UPDATE messages SET received = 1 WHERE receiver = :sender";
        $data = [
            'sender' => $this->props['sender']
        ];
        return $GLOBALS["db"]->insert($query, $data);
    }
    public function updateSeen()
    {
        $query = "UPDATE messages SET seen = 1, received = 1 WHERE receiver = :sender AND msid = :msid";
        $data = [
            'sender' => $this->props['sender'],
            'msid' => $this->messageId()
        ];
        return $GLOBALS["db"]->insert($query, $data);
    }
}