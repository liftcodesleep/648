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


def find_post_data(limit, offset, search_text, sort_col, sort_type):
    cursor, conn = get_cursor()
    sql_statement = "SELECT * FROM Posts"

    if search_text:
        if search_text[0] == '@':
            sql_statement += f" WHERE UPPER(Made_by) LIKE '%{search_text[1:].upper()}%'"

        elif search_text[0] == '#':
            sql_statement += f""" WHERE Post_id in 
                                    (SELECT Post_id FROM Post_tags JOIN Tags
                                    on Post_tags.Tag_id = Tags.Tag_id
                                    WHERE UPPER(Name) LIKE '%{search_text[1:].upper()}%') 
                                    """
        else:
            sql_statement += f" WHERE UPPER(description) LIKE '%{search_text.upper()}%'"

    if sort_col:
        sql_statement += f" ORDER BY {sort_col} {sort_type}"

    if limit > 0 and offset > 0:
        sql_statement += f" LIMIT {limit} OFFSET {offset}"

    cursor.execute(sql_statement)
    data = cursor.fetchall()
    conn.close()
    return data
