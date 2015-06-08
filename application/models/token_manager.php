<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *
 */
class Token_manager extends CI_Model
{

    /**
    * @return bool if YES 验证成功 else 验证失败
    **/
    public function verify_entry(Token_entity $entity)
    {
        $this -> db -> start_cache();
        $this -> db -> from('token');
        $this -> db -> where('user_id', $entity -> user_id);
        $this -> db -> where('session_token', $entity -> session_token);
        $count = $this -> db -> count_all_results();
        if ($count > 0) {
            $query = $this -> db -> get();
            $entity -> session_access = $query -> row(0, 'Token_entity') -> session_access;
            $query -> free_result();
        }
        $this -> db -> stop_cache();
        $this -> db -> flush_cache();
        return $count > 0;
    }

    public function request_token(User_entity $entity)
    {
        $this -> db -> from('token');
        $this -> db -> where('user_id', $entity -> user_id);
        $token = $this -> db -> get() -> row(0, 'Token_entity');
        if (!empty($token)) {
            return $token;
        }
        else {
            $this->load->helper('string');
            $token = new Token_entity;
            $token -> user_id = $entity -> user_id;
            $token -> session_token = random_string('unique');
            $this -> db -> insert('token', $token);
            if ($this -> db -> affected_rows() > 0) {
                return $token;
            }
            else {
                return false;
            }
        }
    }
}
