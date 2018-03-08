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

CREATE TABLE message (
    get_user varchar(255),
    message varchar(255),
    post_user varchar(255),
    get_date varchar(255)
);

CREATE TABLE approve_goods (
    code varchar(255),
    f_01 varchar(255),
    f_02 varchar(255),
    f_03 varchar(255),
    f_04 varchar(255),
    f_05 varchar(255),
    f_06 varchar(255),
    f_07 varchar(255),
    f_08 varchar(255),
    update_date varchar(255)
);
-- Create Table End
