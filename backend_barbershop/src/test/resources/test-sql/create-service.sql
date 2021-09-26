insert into services(id, name_ro, name_en, price, duration) values (20,'Serviciu', 'Service', 10, 20);
insert into services(id, name_ro, name_en, price, duration) values (21,'Serviciu 2', 'Service 2', 20, 40);

insert into packages(id, name_ro, name_en, discount, start_validity_period, end_validity_period, start_discount_period, end_discount_period)
values (7, 'Pachet 1', 'Packet 1', '10', '2021-06-09 09:17:23', '2021-07-09 09:17:23', '2021-06-30 09:17:23','2021-07-02 09:17:23');

insert into package_products(package_id, service_id) values (7,20),(7,21);