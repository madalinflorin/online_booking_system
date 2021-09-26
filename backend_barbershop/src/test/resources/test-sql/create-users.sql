insert into users(id, activate, birth_date, city, country, email, gender, name, password, photo, state, username, nr_appointments)
values (1, true, '2010-01-01','Cluj-Napoca','Romania','ardeleanumadalinf1@gmail.com','M','madalin','madalin','madalin.png','Cluj','madalin1',0),
       (2, true, '2010-01-01','Cluj-Napoca','Romania','brz1998@gmail.com','M','barber','barber','madalin.png','Cluj','barber',0),
       (3, true, '2010-01-01','Cluj-Napoca','Romania','getfit98@gmail.com','M','admin','admin2','madalin.png','Cluj','admin',0)
       ;

insert into roles(id, name) values (1,'ROLE_USER'), (2,'ROLE_BARBER'), (3,'ROLE_ADMIN');

insert into user_roles(user_id,role_id) values (1,1),(2,2),(3,3);

insert into services(id, name_ro, name_en, price, duration) values (20,'Serviciu', 'Service', 10, 20);
insert into services(id, name_ro, name_en, price, duration) values (21,'Serviciu 2', 'Service 2', 20, 40);

insert into packages(id, name_ro, name_en, discount, start_validity_period, end_validity_period, start_discount_period, end_discount_period)
values (7, 'Pachet 1', 'Packet 1', '10', '2021-06-09 09:17:23', '2021-07-09 09:17:23', '2021-06-30 09:17:23','2021-07-02 09:17:23');

insert into package_products(package_id, service_id) values (7,20),(7,21);