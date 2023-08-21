DROP DATABASE IF EXISTS critter_sitters_test;
CREATE DATABASE critter_sitters_test;
USE critter_sitters_test;

DROP TABLE IF EXISTS app_user_role;
DROP TABLE IF EXISTS app_role;
DROP TABLE IF EXISTS app_user;

CREATE TABLE app_role (
    app_role_id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE app_user (
	app_user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(2048) NOT NULL,
    enabled BIT NOT NULL DEFAULT(1),
    rate DECIMAL(7, 2)
);

CREATE TABLE contact_info (
    contact_info_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zipcode VARCHAR(15) NOT NULL,
    app_user_id INT,
    CONSTRAINT fk_app_user_id
		FOREIGN KEY (app_user_id)
        REFERENCES app_user(app_user_id)
);

CREATE TABLE app_user_role (
    app_user_id INT NOT NULL,
    app_role_id INT NOT NULL,
    CONSTRAINT pk_app_user_role
        PRIMARY KEY (app_user_id, app_role_id),
    CONSTRAINT fk_app_user_role_user_id
        FOREIGN KEY (app_user_id)
        REFERENCES app_user(app_user_id),
    CONSTRAINT fk_app_user_role_role_id
        FOREIGN KEY (app_role_id)
        REFERENCES app_role(app_role_id)
);

CREATE TABLE pet (
    pet_id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    notes VARCHAR(2048),
    pet_type VARCHAR(255) NOT NULL,
    goes_walking BOOL,
    owner_id INT NOT NULL,
    CONSTRAINT fk_pet_owner_id
        FOREIGN KEY (owner_id)
        REFERENCES app_user(app_user_id)
);

CREATE TABLE care_visit (
    care_visit_id INT PRIMARY KEY AUTO_INCREMENT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    `status` VARCHAR(255),
    time_of_day TIME NOT NULL,
    notes VARCHAR(2048),
    cost DOUBLE NOT NULL,
    owner_id INT NOT NULL,
    sitter_id INT NOT NULL,
    CONSTRAINT fk_care_visit_owner_id
        FOREIGN KEY (owner_id)
        REFERENCES app_user(app_user_id),
    CONSTRAINT fk_care_visit_sitter_id
        FOREIGN KEY (sitter_id)
        REFERENCES app_user(app_user_id)
);

delimiter //
create procedure set_known_good_state()
begin


    delete from app_role;
    alter table app_role auto_increment = 1;
    delete from app_user_role;
    alter table app_user_role auto_increment = 1;
    delete from contact_info;
    alter table contact_info auto_increment = 1;
    delete from pet;
    alter table pet auto_increment = 1;
    delete from care_visit;
    alter table care_visit auto_increment = 1;
    delete from app_user;
    alter table app_user auto_increment = 1;

    INSERT INTO app_user (username, password_hash, rate, enabled)
        VALUES
        ('Johnnyboy', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', null, 1),
        ('Sally-Jo', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', null, 1),
        ('Finn99', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', null, 1),
        ('CatFriend', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 20, 1),
        ('DogBuddy', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 22, 1);

    INSERT INTO contact_info (first_name, last_name, email, phone_number, street_address, city, state, zipcode, app_user_id) VALUES
        ('John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St', 'Los Angeles', 'CA', '90001', 1),
        ('Sally', 'Jones', 'sally.jones@example.com', '987-654-3210', '23 Leap St', 'New York', 'NY', '10001', 2),
        ('Finn', 'Bert', 'finnbert@example.com', '999-222-1234', '789 Roadlike Ave', 'Chicago', 'IL', '60601', 3),
        ('Cat', 'Friend', 'catfriend@example.com', '434-443-3344', '55 Tater St', 'Spokane', 'WA', '99200', 4),
        ('Dog', 'Buddy', 'dogbuddy@example.com', '212-121-1212', '55 Burger Lane', 'Seattle', 'WA', '93613', 5);

    INSERT INTO app_role (`name`) VALUES
        ('OWNER'),
        ('SITTER');


    INSERT INTO app_user_role
        VALUES
        (1, 1),
        (2, 1),
        (3, 1),
        (4, 2),
        (5, 2);

    INSERT INTO pet (`name`, notes, pet_type, goes_walking, owner_id)
        VALUES
        ('Sprinkle', 'A happy little boy', 'Cat', false, 1),
        ('Spot', 'He\'s old, so walks take a bit longer', 'Dog', true, 2),
        ('Sporcle', 'Stinky little hamster, just check food and water levels. Change bedding if it gets too smelly.', 'Hamster', false, 3);

    INSERT INTO care_visit (start_date, end_date, `status`, time_of_day, notes, cost, owner_id, sitter_id) VALUES
        ('2023-08-15', '2023-08-16', 'Pending', '16:00:00', null, 30.50, 1, 4),
        ('2023-09-01', '2023-09-08', 'Cancelled', '12:00:00', 'Change of plans.', 20.00, 2, 4),
        ('2023-08-21', '2023-08-23', 'Pending', '09:00:00', 'Please watch the hamster', 15.75, 3, 4),
        ('2023-08-16', '2023-08-16', 'Accepted', '08:00:00', 'Give Sprinkle his medicine at noon and at 4:00 please', 20.00, 1, 5),
        ('2023-10-01', '2023-10-21', 'Accepted', '08:00:00', 'You already know the feeding and walking schedule, just call us at any time if something goes wrong.', 325.00, 2, 5),
        ('2023-11-12', '2023-11-19', 'Accepted', '06:00:00', null, 100.50, 3, 5);

    SELECT * FROM app_user;
    SELECT * FROM care_visit;
    SELECT * FROM pet;
    SELECT * FROM contact_info;


end //
delimiter ;