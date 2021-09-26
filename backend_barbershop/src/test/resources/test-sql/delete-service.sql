SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM services where id !=0;

DELETE FROM packages where id !=0;

DELETE FROM package_products where package_id !=0;

DELETE FROM packages where id !=0;


SET FOREIGN_KEY_CHECKS = 1;
