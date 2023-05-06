from django.db import models
import pymysql
import uuid

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


def insert_activity(username, text):
    cursor, conn = get_cursor()
    sql_statement = f"""INSERT INTO activity_log
                        VALUES
                        ('{username}', '{text}', CURRENT_TIMESTAMP)
                        """
    cursor.execute(sql_statement)
    conn.commit()
    conn.close()
    return True


def delete_by_email(email):
    cursor, conn = get_cursor()
    sql_statement = f"""
    DELETE FROM User WHERE Email='{email}'
    """
    cursor.execute(sql_statement)


def check_username(username):
    cursor, conn = get_cursor()
    sql_statement = f"""SELECT * from User WHERE username='{username}'
    """
    cursor.execute(sql_statement)
    row = cursor.fetchone()
    if row == None:
        return True
    return False


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
    # print(collected_data)
    cursor, conn = get_cursor()
    sql_statement = """INSERT INTO `team1_database`.`User`
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
("{name}",
"{email}",
"{userid}",
"{password}",
"{dob}",
NOW(),
"{username}",
"{phonenum}",
"{userpic}",
"{about}",
"{usertype}");""".format(**collected_data)
    # print(sql_statement)
    try:
        cursor.execute(sql_statement)
        conn.commit()
    except Exception as e:
        conn.rollback()
        # print(e)
    finally:
        cursor.close()
        conn.close()
