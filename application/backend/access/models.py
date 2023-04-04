from django.db import models
import pymysql


# Create your models here.

def get_cursor():
    conn = pymysql.connect(
        host='csc648-db-team-1.cp7px58ibcuh.us-east-1.rds.amazonaws.com',
        port=3306,
        user='adminuser',
        password='burritoman2023#',
        db='team1_database'
    )
    cursor = conn.cursor()
    return cursor, conn


def check_login_info(username, password, user_type):
    cursor, conn = get_cursor()
    sql_statement = f"""SELECT * FROM User
                        WHERE username='{username}' 
                        AND password='{password}' 
                        AND user_type='{user_type}'
                    """
    cursor.execute(sql_statement)
    data = cursor.fetchone()
    conn.close()
    return data


def insert_register(collected_data):
    cursor, conn = get_cursor()
    sql_statement = f"""INSERT INTO `team1_database`.`User`
(`Name`,
`Email`,
`Userid`,
`Password`,
`DOB`,
`Date_joined`,
`Username`,
`Phone_number`,
`User_pic`,
`About`,
`User_type`)
VALUES
('{collected_data.get("name")}',
'{collected_data.get("email")}',
'{collected_data.get("userid")}'
'{collected_data.get("password")}',
'{collected_data.get("dob")}',
CURRENT_TIMESTAMP,
'{collected_data.get("username")}',
'{collected_data.get("phonenum")}',
'{collected_data.get("userpic")}',
'{collected_data.get("about")}',
'{collected_data.get("usertype")}');"""
    cursor.execute(sql_statement)
    data = cursor.fetchone()
    conn.commit()
    conn.close()
    return data
