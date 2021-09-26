insert into users(id, activate, birth_date, city, country, email, gender, name, password, photo, state, username, nr_appointments)
values (1, true, '2010-01-01','Cluj-Napoca','Romania','ardeleanumadalinf1@gmail.com','M','madalin','madalin','madalin.png','Cluj','madalin1',0),
       (2, true, '2010-01-01','Cluj-Napoca','Romania','brz1998@gmail.com','M','barber','barber','madalin.png','Cluj','barber',0);

insert into roles(id, name) values (1,'ROLE_USER'), (2,'ROLE_BARBER'), (3,'ROLE_ADMIN');

insert into user_roles(user_id,role_id) values (1,2),(2,2);

insert into program(id, day, start_program, end_program, user_id) values (1, 1, '2021-06-09 09:00:56.745', '2021-06-09 14:00:56.745', 1),
                                                                         (2, 2, '2021-06-09 09:00:56.745', '2021-06-09 14:00:56.745', 1),
                                                                         (3, 1, '2021-06-09 07:00:56.745', '2021-06-09 12:00:56.745', 2);