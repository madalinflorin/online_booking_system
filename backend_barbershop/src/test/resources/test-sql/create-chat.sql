insert into users(id, activate, birth_date, city, country, email, gender, name, password, photo, state, username, nr_appointments)
values (1, true, '2010-01-01','Cluj-Napoca','Romania','ardeleanumadalinf1@gmail.com','M','madalin','madalin','madalin.png','Cluj','madalin1',0),
       (2, true, '2010-01-01','Cluj-Napoca','Romania','brz1998@gmail.com','M','barber','barber','madalin.png','Cluj','barber',0),
       (3, true, '2010-01-01','Cluj-Napoca','Romania','getfit98@gmail.com','M','admin','admin2','madalin.png','Cluj','admin',0)
;

insert into roles(id, name) values (1,'ROLE_USER'), (2,'ROLE_BARBER'), (3,'ROLE_ADMIN');

insert into user_roles(user_id,role_id) values (1,1),(2,2),(3,3);

insert into messages(id, message, time_message, user_id) values (1, 'Salut', '2021-06-09 09:29:07.808', 1);