<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Modifier_entity
{
    public $modifier_id = null;

    public $user_id = 0;

    public $modifier_params = '';

    public $is_valid = 1;

    public function params()
    {
        return json_decode($this->modifier_params, true);
    }
}
