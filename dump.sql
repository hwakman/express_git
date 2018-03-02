-- Create Database Start
CREATE DATABASE user;
-- Create Database End

-- Create Table Start
CREATE TABLE authen (
    email varchar(255),
    password varchar(255),
    type varchar(255)
);

CREATE TABLE goods (
    code varchar(255),
    name varchar(255),
    price varchar(255),
    total varchar(255),
    total_price varchar(255),
    detail varchar(255),
    reg_date varchar(255),
    ex_date varchar(255),
    note varchar(255)
);

CREATE TABLE goods_status (
    editor varchar(255),
    approve varchar(255),
    edit_date varchar(255),
    comment varchar(255)
);

CREATE TABLE history (
    user varchar(255),
    topic varchar(255),
    date varchar(255)
);

CREATE TABLE new_feed (
    topic varchar(255),
    content varchar(255),
    post_by varchar(255),
    post_date varchar(255)
);

CREATE TABLE user (
    name varchar(255),
    email varchar(255),
    tel varchar(255),
    status varchar(255),
    address varchar(255)
);

CREATE TABLE user_status (
    editor varchar(255),
    approve varchar(255),
    edit_date varchar(255),
    comment varchar(255)
);
-- Create Table End

-- Example Data Start
-- Authen
INSERT INTO authen
VALUES ('master@tni.test','1234','001');

INSERT INTO authen
VALUES ('supportmaster@tni.test','1234','002');

INSERT INTO authen
VALUES ('normal@tni.test','1234','003');

-- Goods
INSERT INTO goods
VALUES ('CD001','Red Car','','','','','','','');

INSERT INTO goods
VALUES ('CD002','Red Cat','','','','','','','');

INSERT INTO goods
VALUES ('CD003','Red Apple','','','','','','','');

INSERT INTO goods
VALUES ('CD004','Red Smartphone','','','','','','','');

INSERT INTO goods
VALUES ('CD005','Red Shirt','','','','','','','');

INSERT INTO goods
VALUES ('CD006','Red Dog','','','','','','','');

INSERT INTO goods
VALUES ('CD007','Red Box','','','','','','','');

INSERT INTO goods
VALUES ('CD008','Red Board','','','','','','','');

INSERT INTO goods
VALUES ('CD009','Red Tiger','','','','','','','');

INSERT INTO goods
VALUES ('CD010','Red Pig','','','','','','','');

INSERT INTO goods
VALUES ('CD011','Blue Car','','','','','','','');

INSERT INTO goods
VALUES ('CD012','Blue Cat','','','','','','','');

INSERT INTO goods
VALUES ('CD013','Blue Apple','','','','','','','');

INSERT INTO goods
VALUES ('CD014','Blue Smartphone','','','','','','','');

INSERT INTO goods
VALUES ('CD015','Blue Shirt','','','','','','','');

INSERT INTO goods
VALUES ('CD016','Blue Dog','','','','','','','');

INSERT INTO goods
VALUES ('CD017','Blue Box','','','','','','','');

INSERT INTO goods
VALUES ('CD018','Blue Board','','','','','','','');

INSERT INTO goods
VALUES ('CD019','Blue Tiger','','','','','','','');

INSERT INTO goods
VALUES ('CD020','Blue Pig','','','','','','','');

INSERT INTO goods
VALUES ('CD021','Green Car','','','','','','','');

INSERT INTO goods
VALUES ('CD022','Green Cat','','','','','','','');

INSERT INTO goods
VALUES ('CD023','Green Apple','','','','','','','');

INSERT INTO goods
VALUES ('CD024','Green Smartphone','','','','','','','');

INSERT INTO goods
VALUES ('CD025','Green Shirt','','','','','','','');

INSERT INTO goods
VALUES ('CD026','Green Dog','','','','','','','');

INSERT INTO goods
VALUES ('CD027','Green Box','','','','','','','');

INSERT INTO goods
VALUES ('CD028','Green Board','','','','','','','');

INSERT INTO goods
VALUES ('CD029','Green Tiger','','','','','','','');

INSERT INTO goods
VALUES ('CD030','Green Pig','','','','','','','');
-- Example Data End
