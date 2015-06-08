<?php

/**
 *
 */
class Token_entity
{

    public $user_id = '';

    public $session_token = '';

    public $session_access = '';

    public function canAccess($service)
    {
        static $public_service = array('sub');
        if (in_array($service, $public_service)) {
            return true;
        }
        else if (in_array($service, explode(',',$this->session_access))) {
            return true;
        }
        else {
            return false;
        }
    }
}
