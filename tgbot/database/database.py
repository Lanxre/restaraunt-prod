import sqlite3


class DatabaseException(Exception):
    def __init__(self, message, *errors):
        Exception.__init__(self, message)
        self.errors = errors
    
    def __str__(self):  
        return f'{self.message}: {self.errors}'

class Database:
    def __init__(self, db_name: str):
        try:
            self.conn = sqlite3.connect('database/' + db_name)
            self.cur = self.conn.cursor()
            self._init_db()
        except Exception as e:
            raise DatabaseException(f'Ошибка базы данных: {e}')
    
    def __del__(self):
        self.conn.close()
    
    @property
    def cursor(self):
        return self.cur
    
    @cursor.setter
    def cursor(self, value):
        self.cur = value

    def _init_db(self):
        self.cur.execute("CREATE TABLE IF NOT EXISTS TGUSERS (id INTEGER PRIMARY KEY, first_name text, last_name text, token text, account_uses text)")
        self.conn.commit()

        self.cur.execute("CREATE TABLE IF NOT EXISTS Cart"
        + ' ( '
            +'id       INTEGER PRIMARY KEY AUTOINCREMENT,'
            +'dish_id   INTEGER NOT NULL,'
            +'dish_type INTEGER NOT NULL,'
            +'price     INTEGER,'
            +'user_id   INTEGER REFERENCES TGUSERS (id) ON UPDATE CASCADE,'
            +'status    BOOLEAN'
        + ');'  )
        self.conn.commit()
    




    