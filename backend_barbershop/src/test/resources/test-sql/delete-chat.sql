SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM user_roles where user_id !=0;

DELETE FROM users where id !=0;

DELETE FROM roles where id !=0;

DELETE FROM messages where id!=0;


SET FOREIGN_KEY_CHECKS = 1;
