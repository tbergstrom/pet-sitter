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
    password_hash VARCHAR(2048),
    enabled BIT NOT NULL DEFAULT(1),
    rate DECIMAL(7, 2),
    pfp_url VARCHAR(2048) default('https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80')

);

CREATE TABLE contact_info (
    contact_info_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(20),
    street_address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zipcode VARCHAR(15),
    lat DOUBLE,
    lng DOUBLE,
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


-- -------------------------------------------------------------------------------------------------------------------------------------
-- -- INSERTS -------------------------------------------------------------------------------------------------------------------------
-- -------------------------------------------------------------------------------------------------------------------------------------


-- passwords are set to "P@ssw0rd!"
INSERT INTO app_user (username, password_hash, rate, enabled)
    VALUES
    ('Johnnyboy', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', null, 1),
    ('Sally-Jo', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', null, 1),
    ('Finn99', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', null, 1),
    ('CatFriend', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 20, 1),
    ('DogBuddy', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 22, 1),
	('LoveLizards', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 30, 1),
    ('Horsetershire', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 30, 1),
    ('BillyGoat', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 25, 1),
    ('AllyCat', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 21, 1),
    ('PeterPiker', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 27, 1),
    ('Arty12', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 20, 1),
    ('Coolguy40', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 22, 1),
	('LuvzCats2Much', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 30, 1),
    ('FishTankLovr', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 30, 1),
    ('RodentRangler', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 30, 1);
    
    
    INSERT INTO contact_info (first_name, last_name, email, phone_number, street_address, city, state, zipcode, lat, lng, app_user_id) VALUES
('John', 'Doe', 'john.doe@example.com', '123-456-7890', '400 Broad St', 'Seattle', 'WA', '98109', '47.6203953', '-122.3377493', 1),
('Sally', 'Jones', 'sally.jones@example.com', '987-654-3210', '800 Occidental Ave S', 'Seattle', 'WA', '98134', '47.59324609999999', '-122.3315406', 2),
('Finn', 'Bert', 'finnbert@example.com', '999-222-1234', '337 E Randolph St', 'Chicago', 'IL', '60601', '41.884392', '-87.619110', 3),
('Cat', 'Friend', 'catfriend@example.com', '434-443-3344', '507 N Howard St', 'Spokane', 'WA', '99201', '47.662380', '-117.421471', 4),
('Dog', 'Buddy', 'dogbuddy@example.com', '212-121-1212', '450 110th Ave NE', 'Bellevue', 'WA', '98004', '47.614288', '-122.192291', 5),
('Liz', 'Lizard', 'lvelizards@example.com', '111-111-2211', '4553 Longfellow Ave', 'Minneapolis', 'MN', '55555', '44.920090', '-93.245180', 6),
('Ponyboy', 'Guy', 'horsetershire@example.com', '932-923-9329', '60 E Broadway', 'Bloomington', 'MN', '55425', '44.856529', '-93.239449', 7),
('Billy', 'Jean', 'billy.jean@example.com', '123-456-7890', '2101 N Northlake Way', 'Seattle', 'WA', '98103', '47.646969', '-122.333488', 8),
('Alice', 'Bookworm', 'alice.book@example.com', '111-222-3333', '1000 4th Ave', 'Seattle', 'WA', '98104', '47.606682', '-122.332657', 9),
('Peter', 'Pike', 'peter.pike@example.com', '444-555-6666', '85 Pike St', 'Seattle', 'WA', '98101', '47.609459', '-122.341057', 10),
('Art', 'Muse', 'art.muse@example.com', '777-888-9999', '1300 1st Ave', 'Seattle', 'WA', '98101', '47.607288', '-122.337860', 11),
('Whale', 'Tail', 'whale.tail@example.com', '123-321-4567', '5817 SW Lander St', 'Seattle', 'WA', '98116', '47.5792938', '-122.4068722', 12),
('Aqua', 'Marine', 'aqua.marine@example.com', '765-432-1234', '1483 Alaskan Way', 'Seattle', 'WA', '98101', '47.6073927', '-122.3431492', 13),
('Grace', 'Lake', 'grace.lake@example.com', '890-123-4567', '7201 East Green Lake Dr N', 'Seattle', 'WA', '98115', '47.6801765', '-122.3285312', 14),
('Kenny', 'Kerrypark', 'kenny.kerry@example.com', '555-444-3332', '211 W Highland Dr', 'Seattle', 'WA', '98119', '47.62918', '-122.3599282', 15);

INSERT INTO app_role (`name`) VALUES
    ('OWNER'),
    ('SITTER');


INSERT INTO app_user_role
    VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 2),
    (5, 2),
	(6, 2),
    (7, 2),
    (8, 2),
    (9, 2),
    (10, 2),
    (11, 2),
    (12, 2),
    (13, 2),
    (14, 2),
    (15, 2);

INSERT INTO pet (`name`, notes, pet_type, goes_walking, owner_id)
    VALUES
    ('Sprinkle', 'A happy little boy', 'Cat', false, 1),
    ('Spot', 'He\'s old, so walks take a bit longer', 'Dog', true, 2),
    ('Sporcle', 'Stinky little hamster, just check food and water levels. Change bedding if it gets too smelly.', 'Hamster', false, 3);

INSERT INTO care_visit (start_date, end_date, `status`, time_of_day, notes, cost, owner_id, sitter_id) VALUES
('2023-10-15', '2023-10-16', 'Pending', '16:00:00', null, 30.50, 1, 4),
('2023-10-01', '2023-10-08', 'Cancelled', '12:00:00', 'Change of plans.', 20.00, 2, 4),
('2023-10-21', '2023-10-23', 'Pending', '09:00:00', 'Please watch the hamster', 15.75, 3, 4),
('2023-12-16', '2023-12-16', 'Accepted', '08:00:00', 'Give Sprinkle his medicine at noon and at 4:00 please', 20.00, 1, 5),
('2023-10-01', '2023-10-21', 'Accepted', '08:00:00', 'You already know the feeding and walking schedule, just call us at any time if something goes wrong.', 325.00, 2, 5),
('2023-11-12', '2023-11-19', 'Accepted', '06:00:00', null, 100.50, 3, 5);

UPDATE care_visit cv
JOIN app_user au ON cv.sitter_id = au.app_user_id
SET cv.cost = (DATEDIFF(cv.end_date, cv.start_date)+1) * IFNULL(au.rate, 0)
WHERE cv.care_visit_id IS NOT NULL;
