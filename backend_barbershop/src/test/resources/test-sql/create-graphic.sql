insert into users(id, activate, birth_date, city, country, email, gender, name, password, photo, state, username, nr_appointments)
values (11, true, '2010-01-01','Cluj-Napoca','Romania','ardeleanumadalinf1@gmail.com','M','madalin','madalin','madalin.png','Cluj','madalin1',0),
       (3, true, '2010-01-01','Cluj-Napoca','Romania','brz1998@gmail.com','M','barber','barber','madalin.png','Cluj','barber',0);

insert into roles(id, name) values (1,'ROLE_USER'), (2,'ROLE_BARBER'), (3,'ROLE_ADMIN');

insert into user_roles(user_id,role_id) values (11,1),(3,2);

insert into appointment(id, barber_id, user_id, start_appointment, end_appointment, price) values (1, 3, 11, '2021-06-11 09:35:00','2021-06-11 10:10:00',10);